import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Property } from '../models/Property';
import { User } from '../models/User';
import { Tenant } from '../models/Tenant';
import { ITenant } from '../types/tenant';

async function createTenant(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId } = req.params;
    console.log('Creating tenant for property:', propertyId);

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Créer le locataire
    const tenant = new Tenant({
      ...req.body,
      propertyId,
      status: 'active'
    });

    await tenant.save();
    console.log('Tenant created:', tenant._id);

    const populatedTenant = await Tenant.findById(tenant._id)
      .populate('userId', 'firstName lastName email');

    return res.status(201).json(populatedTenant);
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
    // Récupérer propertyId depuis les paramètres de route
    const { propertyId } = req.params;
    console.log('Fetching tenants for property:', propertyId);

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id
    }).lean();

    if (!property) {
      return res.status(403).json({ message: 'Not authorized to access this property' });
    }

    // Récupérer les locataires de cette propriété
    const tenants = await Tenant.find({
      propertyId,
      status: 'active'
    })
    .populate('userId', 'firstName lastName email')
    .lean();

    console.log(`Found ${tenants.length} tenants for property ${propertyId}`);

    // Convertir les IDs en ObjectId
    const formattedTenants = tenants.map(tenant => ({
      ...tenant,
      _id: new Types.ObjectId(tenant._id.toString()),
      propertyId: new Types.ObjectId(tenant.propertyId.toString()),
      userId: tenant.userId ? new Types.ObjectId(tenant.userId.toString()) : undefined
    })) as ITenant[];

    return res.json(formattedTenants);
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