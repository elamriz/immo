import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';

export const createPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tenant = await Tenant.findById(req.body.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const property = await Property.findOne({
      _id: tenant.propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const payment = new Payment({
      ...req.body,
      propertyId: property._id
    });
    await payment.save();

    return res.status(201).json(payment);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating payment', error });
  }
};

export const getPayments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map(p => p._id);
    
    const payments = await Payment.find({
      propertyId: { $in: propertyIds }
    }).populate('tenantId', 'userId');
    
    return res.json(payments);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// Autres méthodes du contrôleur... 