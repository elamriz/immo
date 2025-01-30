import { Tenant } from './tenant';
import { Property } from './property';

export interface Payment {
  _id: string;
  tenantId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  propertyId: {
    _id: string;
    name: string;
  };
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'late';
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  reference?: string;
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
}

export interface CreatePaymentDto {
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'late';
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  reference?: string;
} 