import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notifications } from '@mantine/notifications';
import axiosInstance from '../api/axios';
import { Ticket } from '../types';

interface CreateTicketDto {
  propertyId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await axiosInstance.get('/tickets');
  return data;
};

const createTicket = async (ticket: CreateTicketDto): Promise<Ticket> => {
  const { data } = await axiosInstance.post('/tickets', ticket);
  return data;
};

const updateTicket = async ({ id, ...ticket }: Partial<Ticket> & { id: string }): Promise<Ticket> => {
  const { data } = await axiosInstance.put(`/tickets/${id}`, ticket);
  return data;
};

const deleteTicket = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tickets/${id}`);
};

export function useTickets() {
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery('tickets', getTickets);

  const addTicket = useMutation(createTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries('tickets');
      notifications.show({
        title: 'Succès',
        message: 'Ticket créé avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la création du ticket',
        color: 'red',
      });
    },
  });

  const updateTicketMutation = useMutation(updateTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries('tickets');
      notifications.show({
        title: 'Succès',
        message: 'Ticket mis à jour avec succès',
        color: 'green',
      });
    },
  });

  const deleteTicketMutation = useMutation(deleteTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries('tickets');
      notifications.show({
        title: 'Succès',
        message: 'Ticket supprimé avec succès',
        color: 'green',
      });
    },
  });

  return {
    tickets,
    isLoading,
    addTicket: addTicket.mutate,
    updateTicket: updateTicketMutation.mutate,
    deleteTicket: deleteTicketMutation.mutate,
  };
} 