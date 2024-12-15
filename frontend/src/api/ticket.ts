import { axiosInstance } from './axios';

interface CreateTicketDto {
  propertyId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  ticketType: 'general' | 'tenant_specific';
  contractorId?: string | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved';
}

export interface Ticket extends CreateTicketDto {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createTicket = async (ticket: CreateTicketDto): Promise<Ticket> => {
  console.log('Sending ticket data:', ticket);
  const response = await axiosInstance.post('/tickets', ticket);
  return response.data;
};

export const getTickets = async (): Promise<Ticket[]> => {
  const response = await axiosInstance.get('/tickets');
  return response.data;
};

export const updateTicket = async (id: string, ticket: Partial<Ticket>): Promise<Ticket> => {
  const response = await axiosInstance.patch(`/tickets/${id}`, ticket);
  return response.data;
};

export const deleteTicket = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tickets/${id}`);
}; 