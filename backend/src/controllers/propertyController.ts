import { Request, Response } from 'express';
import { Property, IProperty } from '../models/Property';
import mongoose, { Types } from 'mongoose';
import { Tenant } from '../models/Tenant';

// Define the ITenant interface to match the Tenant model structure
interface ITenant {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'inactive';
  rentStatus: 'pending' | 'paid';
}

export const createProperty = async (req: Request, res: Response): Promise<Response> => {
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
};

export const getProperties = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('Fetching properties for user:', req.user._id);
    
    // Récupérer les propriétés
    const properties = await Property.find({ owner: req.user._id });

    // Pour chaque propriété, récupérer les informations des locataires
    const propertiesWithTenants = await Promise.all(properties.map(async (property) => {
      const propertyObj = property.toObject();
      
      // Récupérer tous les locataires actifs pour cette propriété
      const tenants = await Tenant.find({ 
        propertyId: property._id,
        status: 'active'
      }).lean();
      
      // Mettre à jour les informations des locataires dans la propriété
      propertyObj.tenants = tenants
        .filter(tenant => tenant._id)
        .map(tenant => {
          // Ensure tenant._id is a string before converting to ObjectId
          const tenantIdStr = tenant._id.toString();
          const tenantId = new Types.ObjectId(tenantIdStr);
          
          return {
            userId: tenantId,
            firstName: tenant.firstName,
            lastName: tenant.lastName,
            leaseStartDate: tenant.leaseStartDate,
            leaseEndDate: tenant.leaseEndDate,
            rentAmount: tenant.rentAmount,
            depositAmount: tenant.depositAmount,
            status: 'active' as const,
            rentStatus: tenant.rentStatus === 'late' ? 'pending' : tenant.rentStatus,
            _id: tenantId
          } as ITenant;
        });
      
      console.log('Mapped tenants for property:', propertyObj.tenants);
      return propertyObj;
    }));

    return res.json(propertiesWithTenants);
  } catch (error) {
    console.error('Error in getProperties:', error);
    return res.status(500).json({ message: 'Error fetching properties', error });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    }).populate('tenants.userId', 'firstName lastName email _id');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const propertyObj = property.toObject();
    propertyObj.tenants = propertyObj.tenants.filter(tenant => tenant.status === 'active');
    
    return res.json(propertyObj);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching property', error });
  }
};

export const updateProperty = async (req: Request, res: Response): Promise<Response> => {
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
};

export const deleteProperty = async (req: Request, res: Response): Promise<Response> => {
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
};

// Nouvelle fonction pour ajouter un locataire à une propriété
export const addTenant = async (req: Request, res: Response): Promise<Response> => {
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
};

// Nouvelle fonction pour mettre à jour un locataire
export const updateTenant = async (req: Request, res: Response): Promise<Response> => {
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
};

export const getProperty = async (req: Request, res: Response): Promise<Response> => {
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
}; 