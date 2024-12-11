import { Request, Response } from 'express';
import { Tenant } from '../models/Tenant';
import { Property } from '../models/Property';

export const createTenant = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Vérifier que la propriété appartient au propriétaire
    const property = await Property.findOne({
      _id: req.body.propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const tenant = new Tenant({
      ...req.body,
      status: 'pending'
    });
    await tenant.save();

    // Mettre à jour la propriété
    property.tenants.push(tenant.userId);
    property.status = 'occupied';
    await property.save();

    return res.status(201).json(tenant);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating tenant', error });
  }
};

export const getTenants = async (req: Request, res: Response): Promise<Response> => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map(p => p._id);
    
    const tenants = await Tenant.find({
      propertyId: { $in: propertyIds }
    }).populate('userId', 'firstName lastName email');
    
    return res.json(tenants);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching tenants', error });
  }
};

// Autres méthodes du contrôleur... 