export interface Ticket {
  _id: string;
  propertyId: {
    _id: string;
    name: string;
  };
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  ticketType: 'general' | 'tenant_specific';
  tenantId?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  assignedContractor?: {
    _id: string;
    name: string;
    specialty: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  propertyId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  ticketType: 'general' | 'tenant_specific';
  tenantId?: string;
  contractorId?: string;
} 