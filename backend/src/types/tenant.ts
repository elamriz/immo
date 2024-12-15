import { Types } from 'mongoose';

export interface ITenant {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: Types.ObjectId;
  userId?: Types.ObjectId;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'inactive';
  rentStatus?: 'pending' | 'paid' | 'late';
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

export interface CreateTenantDto extends Omit<ITenant, '_id' | 'userId' | 'status' | 'history'> {
  propertyId: string;
}

export interface UpdateTenantDto extends Partial<Omit<ITenant, '_id' | 'userId'>> {} 