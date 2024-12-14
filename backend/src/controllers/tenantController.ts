import { Request, Response } from 'express';
import { Tenant } from '../models/Tenant';
import { Property } from '../models/Property';
import mongoose from 'mongoose';

export const createTenant = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('Creating tenant with data:', req.body);
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
      owner: req.user._id
    }).exec();

    if (!property) {
      return res.status(404).json({ message: 'Property not found or not authorized' });
    }

    // Créer le locataire
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

    // Sauvegarder le locataire
    const savedTenant = await tenant.save();
    console.log('Saved tenant:', JSON.stringify(savedTenant, null, 2));

    // Créer l'objet locataire pour la propriété
    const tenantForProperty = {
      userId: savedTenant._id,
      leaseStartDate: new Date(leaseStartDate),
      leaseEndDate: new Date(leaseEndDate),
      rentAmount,
      depositAmount,
      status: status === 'active' ? 'active' : 'inactive',
      rentStatus: rentStatus || 'pending'
    };

    // D'abord, initialiser le tableau tenants s'il n'existe pas
    await Property.updateOne(
      { _id: propertyId },
      { $setOnInsert: { tenants: [] } },
      { upsert: true }
    );

    // Ensuite, mettre à jour la propriété avec le nouveau locataire
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      {
        $push: { tenants: tenantForProperty },
        $set: { status: 'occupied' }
      },
      { 
        new: true,
        runValidators: true
      }
    ).exec();

    console.log('Updated property:', JSON.stringify(updatedProperty, null, 2));

    if (!updatedProperty) {
      // Si la mise à jour de la propriété échoue, supprimer le locataire créé
      await Tenant.findByIdAndDelete(savedTenant._id);
      return res.status(500).json({ message: 'Failed to update property with tenant' });
    }

    // Retourner le locataire créé avec les informations de la propriété
    const populatedTenant = await Tenant.findById(savedTenant._id)
      .populate('propertyId', 'name address');

    return res.status(201).json(populatedTenant);
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
    console.log('Getting tenants for property:', propertyId);

    // Vérifier que la propriété appartient au propriétaire
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id,
    });

    console.log('Found property:', property);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const tenants = await Tenant.find({ propertyId });
    console.log('Found tenants:', tenants);
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
    console.log('Updating tenant with ID:', id);

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

    // Mettre à jour le locataire dans la collection Tenant
    const updatedTenant = await Tenant.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    // Mettre à jour le locataire dans la propriété
    const tenantIndex = property.tenants.findIndex(
      t => t.userId.toString() === id
    );

    if (tenantIndex !== -1) {
      property.tenants[tenantIndex] = {
        ...property.tenants[tenantIndex],
        leaseStartDate: req.body.leaseStartDate || property.tenants[tenantIndex].leaseStartDate,
        leaseEndDate: req.body.leaseEndDate || property.tenants[tenantIndex].leaseEndDate,
        rentAmount: req.body.rentAmount || property.tenants[tenantIndex].rentAmount,
        depositAmount: req.body.depositAmount || property.tenants[tenantIndex].depositAmount,
        status: req.body.status === 'active' ? 'active' : 'inactive',
        rentStatus: req.body.rentStatus || property.tenants[tenantIndex].rentStatus
      };

      await property.save();
    }

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

    // Supprimer le locataire de la collection Tenant
    await Tenant.findByIdAndDelete(id);

    // Supprimer le locataire de la propriété
    property.tenants = property.tenants.filter(
      t => t.userId.toString() !== id
    );

    // Mettre à jour le statut de la propriété si nécessaire
    if (property.tenants.length === 0) {
      property.status = 'available';
    }
    
    await property.save();

    return res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return res.status(500).json({ 
      message: 'Error deleting tenant', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};