export interface Tenant {
  id: string;
  userId: string;
  propertyId: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  monthlyRent: number;
  depositAmount: number;
  status: 'active' | 'pending' | 'ended';
  documents?: string[];
}

export interface CreateTenantDto extends Omit<Tenant, 'id'> {} 