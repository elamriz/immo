import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  leaseStartDate: Date;
  leaseEndDate: Date;
  monthlyRent: number;
  depositAmount: number;
  status: 'active' | 'pending' | 'ended';
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  leaseStartDate: { type: Date, required: true },
  leaseEndDate: { type: Date, required: true },
  monthlyRent: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'pending', 'ended'],
    default: 'pending'
  },
  documents: [{ type: String }]
}, {
  timestamps: true
});

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema); 