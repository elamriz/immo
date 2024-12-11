import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: mongoose.Types.ObjectId;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'pending' | 'ended';
  rentStatus: 'paid' | 'pending' | 'late';
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  propertyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Property',
    required: true 
  },
  leaseStartDate: { type: Date, required: true },
  leaseEndDate: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'pending', 'ended'],
    default: 'pending',
    required: true 
  },
  rentStatus: { 
    type: String, 
    enum: ['paid', 'pending', 'late'],
    default: 'pending',
    required: true 
  },
  documents: [{ type: String }]
}, {
  timestamps: true
});

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema); 