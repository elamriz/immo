import { Request, Response } from 'express';
import { Property } from '../models/Property';

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
    const properties = await Property.find({ owner: req.user._id });
    return res.json(properties);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching properties', error });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    return res.json(property);
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
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.json(property);
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