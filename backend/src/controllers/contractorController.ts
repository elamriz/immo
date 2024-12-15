import { Request, Response } from 'express';
import { Contractor } from '../models/Contractor';

export const createContractor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contractor = new Contractor(req.body);
    await contractor.save();
    return res.status(201).json(contractor);
  } catch (error) {
    console.error('Error creating contractor:', error);
    return res.status(500).json({ 
      message: 'Error creating contractor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getContractors = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contractors = await Contractor.find({ status: 'active' });
    return res.json(contractors);
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return res.status(500).json({ 
      message: 'Error fetching contractors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateContractor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    return res.json(contractor);
  } catch (error) {
    console.error('Error updating contractor:', error);
    return res.status(500).json({ 
      message: 'Error updating contractor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteContractor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    return res.json({ message: 'Contractor deactivated successfully' });
  } catch (error) {
    console.error('Error deleting contractor:', error);
    return res.status(500).json({ 
      message: 'Error deleting contractor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addRating = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { score, comment } = req.body;
    const contractor = await Contractor.findById(req.params.id);

    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    contractor.ratings.push({
      score,
      comment,
      createdBy: req.user._id,
      createdAt: new Date()
    });

    await contractor.save();
    return res.json(contractor);
  } catch (error) {
    console.error('Error adding rating:', error);
    return res.status(500).json({ 
      message: 'Error adding rating',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 