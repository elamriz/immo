import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITenant {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'inactive';
  rentStatus: 'pending' | 'paid' | 'late';
  documents?: {
    leaseContract?: string;
    idCard?: string;
    proofOfIncome?: string;
    insuranceCertificate?: string;
  };
  notes?: string;
  history?: {
    action: string;
    date: Date;
    details?: string;
  }[];
}

export interface IProperty extends Document {
  name: string;
  address: string;
  type: 'house' | 'apartment' | 'commercial';
  size: number;
  numberOfRooms: number;
  maxTenants: number;
  rentAmount: number;
  description?: string;
  status: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
  images?: string[];
  owner: Types.ObjectId;
  tenants: ITenant[];
  isCoLiving: boolean;
  coLivingDetails?: {
    totalRent: number;
    maxCoTenants: number;
    sharedAreas: string[];
    commonCharges: {
      internet?: number;
      electricity?: number;
      water?: number;
      heating?: number;
    };
  };
}

const tenantSchema = new Schema<ITenant>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  leaseStartDate: { type: Date, required: true },
  leaseEndDate: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  rentStatus: { type: String, enum: ['pending', 'paid', 'late'], default: 'pending' },
  documents: {
    leaseContract: String,
    idCard: String,
    proofOfIncome: String,
    insuranceCertificate: String
  },
  notes: String,
  history: [{
    action: String,
    date: { type: Date, default: Date.now },
    details: String
  }]
});

const propertySchema = new Schema<IProperty>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['house', 'apartment', 'commercial'],
    required: true 
  },
  size: { type: Number, required: true },
  numberOfRooms: { type: Number, required: true },
  maxTenants: { type: Number, required: true },
  rentAmount: { type: Number, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  tenants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    leaseStartDate: {
      type: Date,
      required: true
    },
    leaseEndDate: {
      type: Date
    },
    rentAmount: {
      type: Number,
      required: true
    },
    depositAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending'
    },
    rentStatus: {
      type: String,
      enum: ['pending', 'paid', 'late'],
      default: 'pending'
    }
  }],
  isCoLiving: {
    type: Boolean,
    default: false
  },
  coLivingDetails: {
    totalRent: Number,
    sharedAreas: [String],
    maxCoTenants: Number,
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

export const Property = mongoose.model<IProperty>('Property', propertySchema); 