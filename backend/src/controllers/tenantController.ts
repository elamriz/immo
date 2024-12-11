import { Request, Response } from 'express';
import { Tenant } from '../models/Tenant';
import { Property } from '../models/Property';

export const createTenant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      propertyId,
      leaseStartDate,
      leaseEndDate,
      rentAmount,
      depositAmount,
      status,
      rentStatus,
    } = req.body;

    // Vérifier que la propriété existe et appartient au propriétaire
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id,
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const tenant = new Tenant({
      firstName,
      lastName,
      email,
      phone,
      propertyId,
      leaseStartDate,
      leaseEndDate,
      rentAmount,
      depositAmount,
      status,
      rentStatus,
    });

    await tenant.save();

    // Mettre à jour la propriété
    property.status = 'occupied';
    await property.save();

    return res.status(201).json(tenant);
  } catch (error) {
    console.error('Error creating tenant:', error);
    return res.status(500).json({ 
      message: 'Error creating tenant', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const getTenants = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { propertyId } = req.query;

    // Vérifier que la propriété appartient au propriétaire
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id,
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const tenants = await Tenant.find({ propertyId });
    return res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return res.status(500).json({ 
      message: 'Error fetching tenants', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const updateTenant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    console.log('Updating tenant with ID:', id); // Pour le debug

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Vérifier que la propriété appartient au propriétaire
    const property = await Property.findOne({
      _id: tenant.propertyId,
      owner: req.user._id,
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.json(updatedTenant);
  } catch (error) {
    console.error('Error updating tenant:', error);
    return res.status(500).json({ 
      message: 'Error updating tenant', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const deleteTenant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Vérifier que la propriété appartient au propriétaire
    const property = await Property.findOne({
      _id: tenant.propertyId,
      owner: req.user._id,
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await Tenant.findByIdAndDelete(id);

    // Mettre à jour le statut de la propriété si nécessaire
    const remainingTenants = await Tenant.find({ propertyId: property._id });
    if (remainingTenants.length === 0) {
      property.status = 'available';
      await property.save();
    }

    return res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return res.status(500).json({ 
      message: 'Error deleting tenant', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};