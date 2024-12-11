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
  status: 'active' | 'pending' | 'ended';
  rentStatus: 'paid' | 'pending' | 'late';
  documents?: string[];
}

export interface CreateTenantDto extends Omit<Tenant, '_id'> {} 