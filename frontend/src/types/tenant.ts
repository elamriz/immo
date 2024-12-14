export interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'pending' | 'active' | 'ended';
  rentStatus: 'paid' | 'pending' | 'late';
}

export interface CreateTenantDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'pending' | 'active' | 'ended';
  rentStatus: 'paid' | 'pending' | 'late';
} 