import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';
import { ITenant } from '../types/tenant';

// Définir les fonctions sans les exporter individuellement
async function createProperty(req: Request, res: Response): Promise<Response> {
  try {
    const property = new Property({
      ...req.body,
      owner: req.user._id
    });
    await property.save();
    return res.status(201).json(property);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating property', error });
  }
}

async function getProperties(req: Request, res: Response): Promise<Response> {
  try {
    console.log('Fetching properties for user:', req.user._id);
    
    // Récupérer les propriétés
    const properties = await Property.find({ owner: req.user._id });

    // Pour chaque propriété, récupérer les locataires
    const propertiesWithTenants = await Promise.all(properties.map(async (property) => {
      const propertyObj = property.toObject();
      
      // Récupérer les locataires actifs pour cette propriété
      const tenants = await Tenant.find({ 
        propertyId: property._id,
        status: 'active'
      }).lean();

      // Convertir les _id en ObjectId en passant par string
      const formattedTenants = tenants.map(tenant => ({
        ...tenant,
        _id: new Types.ObjectId(tenant._id.toString()),
        propertyId: new Types.ObjectId(tenant.propertyId.toString()),
        userId: tenant.userId ? new Types.ObjectId(tenant.userId.toString()) : undefined
      })) as ITenant[];

      console.log(`Tenants for property ${property._id}:`, formattedTenants);
      
      // Assigner les locataires à la propriété
      propertyObj.tenants = formattedTenants;
      
      return propertyObj;
    }));

    return res.json(propertiesWithTenants);
  } catch (error) {
    console.error('Error in getProperties:', error);
    return res.status(500).json({ 
      message: 'Error fetching properties', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getProperty(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: id,
      owner: req.user._id
    })
    .populate('tenants')
    .lean();

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({
      message: 'Error fetching property',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function updateProperty(req: Request, res: Response): Promise<Response> {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    ).populate('tenants.userId', 'firstName lastName email _id');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const propertyObj = property.toObject();
    propertyObj.tenants = propertyObj.tenants.filter(tenant => tenant.status === 'active');

    return res.json(propertyObj);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating property', error });
  }
}

async function deleteProperty(req: Request, res: Response): Promise<Response> {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting property', error });
  }
}

async function addTenant(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId } = req.params;
    const tenantData = req.body;

    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.tenants.push(tenantData);
    await property.save();

    const updatedProperty = await Property.findById(propertyId)
      .populate('tenants.userId', 'firstName lastName email _id');

    return res.json(updatedProperty);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding tenant', error });
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
          'tenants.$': updateData
        }
      },
      { new: true }
    ).populate('tenants.userId', 'firstName lastName email _id');

    if (!property) {
      return res.status(404).json({ message: 'Property or tenant not found' });
    }

    return res.json(property);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating tenant', error });
  }
}

async function getPropertyStats(req: Request, res: Response): Promise<Response> {
  try {
    const properties = await Property.find({ owner: req.user._id });
    
    const stats = {
      total: properties.length,
      occupied: properties.filter(p => p.status === 'occupied').length,
      available: properties.filter(p => p.status === 'available').length,
      maintenance: properties.filter(p => p.status === 'maintenance').length,
      totalRent: properties.reduce((sum, p) => sum + p.rentAmount, 0)
    };

    return res.json(stats);
  } catch (error) {
    console.error('Error getting property stats:', error);
    return res.status(500).json({
      message: 'Error getting property stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getPropertyTenants(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId } = req.params;
    console.log('Fetching tenants for property:', propertyId);

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Récupérer les locataires actifs de cette propriété
    const tenants = await Tenant.find({
      propertyId: propertyId,
      status: 'active'
    }).lean();

    console.log('Found tenants:', tenants);

    return res.json(tenants);
  } catch (error) {
    console.error('Error getting property tenants:', error);
    return res.status(500).json({
      message: 'Error getting property tenants',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Un seul export à la fin du fichier
export {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  addTenant,
  updateTenant,
  getPropertyStats,
  getPropertyTenants
}; 