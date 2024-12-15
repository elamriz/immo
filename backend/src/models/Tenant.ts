import mongoose, { Document, Schema } from 'mongoose';
import { IProperty } from './Property';

export interface ITenant extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: mongoose.Types.ObjectId | IProperty;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'pending' | 'ended';
  rentStatus: 'paid' | 'pending' | 'late';
  documents?: string[];
  rentShare: {
    percentage: number;
    amount: number;
  };
  isMainTenant: boolean;
  coTenants?: mongoose.Types.ObjectId[];
  individualContract: boolean;
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
  documents: [{ type: String }],
  rentShare: {
    percentage: {
      type: Number,
      validate: {
        validator: async function(this: { rentShare?: { percentage: number }, propertyId: any }) {
          if (!this.propertyId) return true;
          const property = await mongoose.model('Property').findById(this.propertyId);
          if (!property?.isCoLiving) return true;
          const percentage = this.rentShare?.percentage || 0;
          return percentage >= 0 && percentage <= 100;
        },
        message: 'Le pourcentage doit être entre 0 et 100 pour une colocation'
      }
    },
    amount: {
      type: Number,
      validate: {
        validator: async function(this: { rentShare?: { amount: number }, propertyId: any }) {
          if (!this.propertyId) return true;
          const property = await mongoose.model('Property').findById(this.propertyId);
          if (!property?.isCoLiving) return true;
          return (this.rentShare?.amount || 0) > 0;
        },
        message: 'Le montant doit être positif pour une colocation'
      }
    }
  },
  isMainTenant: {
    type: Boolean,
    default: false
  },
  coTenants: [{
    type: Schema.Types.ObjectId,
    ref: 'Tenant'
  }],
  individualContract: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware pour valider les parts de loyer
tenantSchema.pre('save', async function(next) {
  if (!this.isModified('rentShare')) return next();

  try {
    const property = await mongoose.model('Property').findById(this.propertyId);
    if (!property?.isCoLiving || !this.rentShare) {
      return next();
    }

    // Vérifier que la somme des parts ne dépasse pas 100%
    const coTenants = await mongoose.model('Tenant')
      .find({ 
        propertyId: this.propertyId,
        _id: { $ne: this._id }
      });

    const totalPercentage = coTenants.reduce(
      (sum, tenant) => sum + (tenant.rentShare?.percentage || 0),
      this.rentShare.percentage
    );

    if (totalPercentage > 100) {
      throw new Error('La somme des parts de loyer ne peut pas dépasser 100%');
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema); 