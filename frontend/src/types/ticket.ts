export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  ticketType: 'general' | 'tenant_specific';
  propertyId: {
    _id: string;
    name: string;
  };
  tenantId?: string;
  tenantInfo?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
} 