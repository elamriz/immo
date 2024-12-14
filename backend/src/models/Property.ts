import mongoose, { Document, Schema } from 'mongoose';

interface Tenant {
  userId: mongoose.Types.ObjectId;
  leaseStartDate: Date;
  leaseEndDate?: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'inactive';
  rentStatus: 'pending' | 'paid';
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
  owner: mongoose.Types.ObjectId;
  tenants: Tenant[];
  createdAt: Date;
  updatedAt: Date;
}

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
      enum: ['active', 'inactive'],
      default: 'active'
    },
    rentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

export const Property = mongoose.model<IProperty>('Property', propertySchema); 