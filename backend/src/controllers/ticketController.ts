import { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';
import { Types } from 'mongoose';
import { Contractor } from '../models/Contractor';

export const createTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { propertyId, title, description, priority, ticketType, tenantId, contractorId } = req.body;
    
    console.log('Received ticket data:', {
      propertyId,
      title,
      description,
      priority,
      ticketType,
      tenantId,
      contractorId
    });

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Vérifier le locataire si nécessaire
    if (ticketType === 'tenant_specific' && tenantId) {
      const tenant = await Tenant.findOne({
        _id: tenantId,
        propertyId: propertyId,
        status: 'active'
      });

      if (!tenant) {
        return res.status(400).json({ 
          message: 'Le locataire spécifié n\'est pas associé à cette propriété ou n\'est pas actif'
        });
      }
    }

    // Vérifier le réparateur si fourni
    if (contractorId) {
      const contractor = await Contractor.findById(contractorId);
      if (!contractor) {
        return res.status(404).json({ message: 'Contractor not found' });
      }
    }

    // Créer l'objet ticket
    const ticketData: any = {
      propertyId: new Types.ObjectId(propertyId),
      title,
      description,
      priority,
      status: contractorId ? 'assigned' : 'open',
      ticketType
    };

    // Ajouter le locataire si spécifié
    if (tenantId) {
      ticketData.tenantId = new Types.ObjectId(tenantId);
    }

    // Ajouter le réparateur si spécifié
    if (contractorId) {
      ticketData.assignedContractor = new Types.ObjectId(contractorId);
    }

    console.log('Creating ticket with data:', ticketData);

    const ticket = new Ticket(ticketData);
    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('propertyId', 'name')
      .populate('tenantId', 'firstName lastName')
      .populate('assignedContractor', 'name specialty');

    console.log('Created ticket with populated data:', populatedTicket);
    return res.status(201).json(populatedTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    return res.status(500).json({
      message: 'Error creating ticket',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getTickets = async (req: Request, res: Response): Promise<Response> => {
  try {
    const properties = await Property.find({ owner: req.user._id }).lean();
    const propertyIds = properties.map(p => p._id);

    const tickets = await Ticket.find({
      propertyId: { $in: propertyIds }
    })
    .populate('propertyId', 'name')
    .populate('tenantId', 'firstName lastName')
    .populate('assignedContractor', 'name specialty')
    .lean();

    return res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({
      message: 'Error fetching tickets',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: ticket.propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    )
    .populate('propertyId', 'name')
    .populate('tenantId', 'firstName lastName')
    .populate('assignedContractor', 'name specialty');

    return res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return res.status(500).json({
      message: 'Error updating ticket',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: ticket.propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Ticket.findByIdAndDelete(id);
    return res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return res.status(500).json({
      message: 'Error deleting ticket',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.comments.push({
      author: req.user._id,
      content,
      createdAt: new Date()
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate('propertyId', 'name')
      .populate('tenantId', 'firstName lastName')
      .populate('assignedContractor', 'name specialty')
      .populate('comments.author', 'firstName lastName');

    return res.json(updatedTicket);
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({
      message: 'Error adding comment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const assignContractor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { contractorId } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: ticket.propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Vérifier que le réparateur existe
    if (contractorId) {
      const contractor = await Contractor.findById(contractorId);
      if (!contractor) {
        return res.status(404).json({ message: 'Contractor not found' });
      }
    }

    // Mettre à jour le ticket
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { 
        assignedContractor: contractorId,
        status: contractorId ? 'assigned' : 'open'
      },
      { new: true }
    )
    .populate('propertyId', 'name')
    .populate('tenantId', 'firstName lastName')
    .populate('assignedContractor', 'name specialty');

    return res.json(updatedTicket);
  } catch (error) {
    console.error('Error assigning contractor:', error);
    return res.status(500).json({
      message: 'Error assigning contractor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addAttachment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Gérer l'upload des fichiers (à implémenter avec un service de stockage)
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    ticket.attachments.push(...fileUrls);
    
    await ticket.save();

    return res.json(ticket);
  } catch (error) {
    console.error('Error adding attachment:', error);
    return res.status(500).json({
      message: 'Error adding attachment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const startWork = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Vérifier que le ticket est bien assigné
    if (ticket.status !== 'assigned') {
      return res.status(400).json({ 
        message: 'Le ticket doit être assigné avant de pouvoir commencer les travaux' 
      });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { 
        status: 'in_progress',
        workStartedAt: new Date()
      },
      { new: true }
    )
    .populate('propertyId', 'name')
    .populate('tenantId', 'firstName lastName')
    .populate('assignedContractor', 'name specialty');

    // Ajouter un commentaire automatique
    if (updatedTicket) {
      updatedTicket.comments.push({
        author: req.user._id,
        content: 'Les travaux ont commencé',
        createdAt: new Date()
      });
      await updatedTicket.save();
    }

    return res.json(updatedTicket);
  } catch (error) {
    console.error('Error starting work:', error);
    return res.status(500).json({
      message: 'Error starting work',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const resolveTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Vérifier que le ticket est en cours
    if (ticket.status !== 'in_progress') {
      return res.status(400).json({ 
        message: 'Le ticket doit être en cours avant de pouvoir être résolu' 
      });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { 
        status: 'resolved',
        resolvedAt: new Date(),
        resolution
      },
      { new: true }
    )
    .populate('propertyId', 'name')
    .populate('tenantId', 'firstName lastName')
    .populate('assignedContractor', 'name specialty');

    // Ajouter un commentaire de résolution
    if (updatedTicket) {
      updatedTicket.comments.push({
        author: req.user._id,
        content: `Ticket résolu : ${resolution}`,
        createdAt: new Date()
      });
      await updatedTicket.save();
    }

    return res.json(updatedTicket);
  } catch (error) {
    console.error('Error resolving ticket:', error);
    return res.status(500).json({
      message: 'Error resolving ticket',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 