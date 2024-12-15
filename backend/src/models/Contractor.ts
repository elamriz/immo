import mongoose, { Document, Schema } from 'mongoose';

export interface IContractor extends Document {
  name: string;
  phone: string;
  email?: string;
  specialty: string;
  location?: string;
  status: 'active' | 'inactive';
  ratings: {
    score: number;
    comment: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  completedJobs: number;
  createdAt: Date;
  updatedAt: Date;
}

const contractorSchema = new Schema<IContractor>({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    lowercase: true,
    trim: true
  },
  specialty: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String 
  },
  status: { 
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  ratings: [{
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  completedJobs: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Contractor = mongoose.model<IContractor>('Contractor', contractorSchema); 