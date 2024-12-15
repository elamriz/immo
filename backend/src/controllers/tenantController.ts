import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Property, ITenant } from '../models/Property';
import { User, IUser } from '../models/User';

async function createTenant(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      leaseStartDate,
      leaseEndDate,
      rentAmount,
      depositAmount
    } = req.body;

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Créer un nouvel utilisateur pour le locataire
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      role: 'tenant'
    });
    const savedUser = await user.save() as IUser;

    // Convertir l'ID en string puis en ObjectId
    const userId = new Types.ObjectId(savedUser._id);

    // Créer le locataire
    const tenantData: ITenant = {
      _id: new Types.ObjectId(),
      userId,
      firstName,
      lastName,
      email,
      phone,
      leaseStartDate: new Date(leaseStartDate),
      leaseEndDate: new Date(leaseEndDate),
      rentAmount,
      depositAmount,
      status: 'active',
      rentStatus: 'pending',
      documents: {},
      history: [{
        action: 'created',
        date: new Date(),
        details: 'Tenant created'
      }]
    };

    // Ajouter le locataire à la propriété
    property.tenants.push(tenantData);
    property.status = 'occupied';
    await property.save();

    const updatedProperty = await Property.findById(propertyId)
      .populate('tenants.userId', 'firstName lastName email');

    return res.status(201).json(updatedProperty);
  } catch (error) {
    console.error('Error creating tenant:', error);
    return res.status(500).json({
      message: 'Error creating tenant',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function updateTenant(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId, tenantId } = req.params;
    const updateData = req.body;

    const property = await Property.findOneAndUpdate(
      {
        _id: propertyId,
        owner: req.user._id,
        'tenants._id': tenantId
      },
      {
        $set: {
          'tenants.$': {
            ...updateData,
            _id: new Types.ObjectId(tenantId),
            history: [
              ...(updateData.history || []),
              {
                action: 'updated',
                date: new Date(),
                details: 'Tenant information updated'
              }
            ]
          }
        }
      },
      { new: true }
    ).populate('tenants.userId', 'firstName lastName email');

    if (!property) {
      return res.status(404).json({ message: 'Property or tenant not found' });
    }

    return res.json(property);
  } catch (error) {
    console.error('Error updating tenant:', error);
    return res.status(500).json({
      message: 'Error updating tenant',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getTenants(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId } = req.query;

    // Si un propertyId est fourni, filtrer par propriété
    const query = propertyId ? { 'tenants.propertyId': propertyId } : {};

    // Récupérer toutes les propriétés de l'utilisateur
    const properties = await Property.find({
      owner: req.user._id,
      ...query
    }).populate('tenants.userId', 'firstName lastName email');

    // Extraire tous les locataires actifs
    const tenants = properties.reduce((acc: ITenant[], property) => {
      const activeTenants = property.tenants.filter(tenant => tenant.status === 'active');
      return [...acc, ...activeTenants];
    }, []);

    return res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return res.status(500).json({
      message: 'Error fetching tenants',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function deleteTenant(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId, tenantId } = req.params;

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id,
      'tenants._id': tenantId
    });

    if (!property) {
      return res.status(404).json({ message: 'Property or tenant not found' });
    }

    // Mettre à jour le statut du locataire à 'inactive' au lieu de le supprimer
    const updatedProperty = await Property.findOneAndUpdate(
      {
        _id: propertyId,
        'tenants._id': tenantId
      },
      {
        $set: {
          'tenants.$.status': 'inactive',
          'tenants.$.history': [
            ...(property.tenants.find(t => t._id.toString() === tenantId)?.history || []),
            {
              action: 'deleted',
              date: new Date(),
              details: 'Tenant marked as inactive'
            }
          ]
        }
      },
      { new: true }
    ).populate('tenants.userId', 'firstName lastName email');

    // Si c'était le dernier locataire actif, mettre à jour le statut de la propriété
    const hasActiveTenants = property.tenants.some(
      tenant => tenant.status === 'active' && tenant._id.toString() !== tenantId
    );
    
    if (!hasActiveTenants) {
      property.status = 'available';
      await property.save();
    }

    return res.json(updatedProperty);
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return res.status(500).json({
      message: 'Error deleting tenant',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export {
  createTenant,
  getTenants,
  updateTenant,
  deleteTenant
};