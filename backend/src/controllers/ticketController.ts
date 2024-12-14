import { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';
import { Types } from 'mongoose';

export const createTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { propertyId, title, description, priority, ticketType, tenantId } = req.body;
    
    console.log('Creating ticket with data:', {
      propertyId,
      title,
      description,
      priority,
      ticketType,
      tenantId
    });

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id
    });

    if (!property) {
      console.log('Property not found:', { propertyId, userId: req.user._id });
      return res.status(404).json({ message: 'Property not found' });
    }

    // Vérifier que le locataire existe et est lié à la propriété si c'est un ticket spécifique
    if (ticketType === 'tenant_specific' && tenantId) {
      console.log('Checking tenant:', { tenantId, propertyId });
      
      // Vérifier d'abord dans la collection Tenant
      const tenant = await Tenant.findOne({
        _id: tenantId,
        propertyId: propertyId,
        status: 'active'
      });

      if (!tenant) {
        console.log('Tenant not found or not active:', { tenantId, propertyId });
        return res.status(400).json({ 
          message: 'Le locataire spécifié n\'est pas associé à cette propriété ou n\'est pas actif',
          details: {
            tenantId,
            propertyId,
            ticketType
          }
        });
      }
    }

    const ticketData = {
      propertyId: new Types.ObjectId(propertyId),
      title,
      description,
      priority,
      status: 'open',
      ticketType,
      ...(tenantId && { tenantId: new Types.ObjectId(tenantId) })
    };

    console.log('Creating ticket with data:', ticketData);

    const ticket = new Ticket(ticketData);
    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('propertyId', 'name')
      .populate('tenantId', 'firstName lastName email');

    console.log('Created ticket:', populatedTicket);
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
    .lean();

    // Récupérer tous les tenants une seule fois
    const tenantIds = tickets
      .filter(ticket => ticket.ticketType === 'tenant_specific' && ticket.tenantId)
      .map(ticket => ticket.tenantId);

    const tenants = await Tenant.find({
      _id: { $in: tenantIds }
    }).lean();

    // Créer un Map pour un accès rapide aux tenants
    const tenantsMap = new Map(
      tenants.map(tenant => [tenant._id.toString(), tenant])
    );

    // Enrichir les tickets avec les informations du tenant
    const enrichedTickets = tickets.map((ticket) => {
      if (ticket.ticketType === 'tenant_specific' && ticket.tenantId) {
        const tenant = tenantsMap.get(ticket.tenantId.toString());
        
        if (tenant) {
          console.log('Found tenant:', tenant);
          return {
            ...ticket,
            tenantInfo: {
              firstName: tenant.firstName,
              lastName: tenant.lastName
            }
          };
        }
      }
      return ticket;
    });

    // Log final enriched tickets
    console.log('Final enriched tickets:', enrichedTickets.map(ticket => ({
      _id: ticket._id,
      tenantId: ticket.tenantId,
      tenantInfo: ticket.tenantInfo,
      ticketType: ticket.ticketType,
      propertyId: ticket.propertyId._id
    })));

    return res.json(enrichedTickets);
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
    .populate('tenantId', 'firstName lastName');

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
      .populate('comments.author', 'firstName lastName')
      .populate('propertyId', 'name')
      .populate('tenantId', 'firstName lastName')
      .populate('assignedTo', 'firstName lastName');

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

    ticket.assignedTo = contractorId;
    ticket.status = 'in_progress';
    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate('assignedTo', 'firstName lastName')
      .populate('propertyId', 'name');

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