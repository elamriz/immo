import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'late';
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  reference?: string;
  tenantId: Types.ObjectId;
  propertyId: Types.ObjectId;
  isCoLivingShare: boolean;
  shareDetails?: {
    percentage: number;
    totalRent: number;
    commonCharges: {
      internet?: number;
      electricity?: number;
      water?: number;
      heating?: number;
    };
  };
  history?: Array<{
    action: string;
    performedBy: Types.ObjectId;
    timestamp: Date;
  }>;
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
  },
  isCoLivingShare: {
    type: Boolean,
    default: false
  },
  shareDetails: {
    percentage: Number,
    totalRent: Number,
    commonCharges: {
      internet: Number,
      electricity: Number,
      water: Number,
      heating: Number
    }
  }
}, {
  timestamps: true
});

// Middleware pour calculer le montant en fonction des parts
paymentSchema.pre('save', async function(next) {
  if (this.isCoLivingShare && this.shareDetails) {
    // Calculer le montant du loyer
    const rentShare = (this.shareDetails.totalRent * this.shareDetails.percentage) / 100;
    
    // Calculer les charges
    const charges = Object.values(this.shareDetails.commonCharges || {}).reduce(
      (sum, charge) => sum + (charge || 0),
      0
    );

    // Mettre à jour le montant total
    this.amount = rentShare + charges;
  }
  next();
});

// Ajouter des index composites pour améliorer les performances
paymentSchema.index({ propertyId: 1, status: 1 });
paymentSchema.index({ tenantId: 1, dueDate: 1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema); 