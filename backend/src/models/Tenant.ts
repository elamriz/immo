import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'inactive';
}

const tenantSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  propertyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Property',
    required: true,
    index: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  leaseStartDate: { type: Date, required: true },
  leaseEndDate: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Ajouter un index composé
tenantSchema.index({ propertyId: 1, status: 1 });

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema); 