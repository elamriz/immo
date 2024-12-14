import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  tenantId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'late';
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  dueDate: { 
    type: Date, 
    required: true,
    index: true
  },
  paidDate: { 
    type: Date 
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'late'],
    default: 'pending',
    required: true,
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'check']
  },
  reference: { 
    type: String 
  }
}, {
  timestamps: true
});

// Ajouter des index composites pour améliorer les performances
paymentSchema.index({ propertyId: 1, status: 1 });
paymentSchema.index({ tenantId: 1, dueDate: 1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema); 