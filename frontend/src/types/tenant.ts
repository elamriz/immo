import { Types } from 'mongoose';

export interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'inactive';
  propertyId: string;
}

export interface CreateTenantDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  propertyId: string;
} 