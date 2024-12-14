import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notifications } from '@mantine/notifications';
import { getPayments, createPayment, deletePayment } from '../api/payment';
import { Payment, CreatePaymentDto } from '../types/payment';

export function usePayments() {
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery(
    'payments',
    getPayments,
    {
      staleTime: 1000 * 60, // 1 minute
      cacheTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const addPayment = useMutation(
    (newPayment: CreatePaymentDto) => createPayment(newPayment),
    {
      onMutate: async (newPayment) => {
        // Annuler les requêtes en cours
        await queryClient.cancelQueries('payments');

        // Snapshot de l'ancien état
        const previousPayments = queryClient.getQueryData<Payment[]>('payments');

        // Optimistically update
        queryClient.setQueryData<Payment[]>('payments', (old = []) => [
          ...old,
          {
            ...newPayment,
            _id: 'temp-id-' + Date.now(),
            tenantId: {
              _id: newPayment.tenantId,
              firstName: 'Loading...',
              lastName: 'Loading...'
            },
            propertyId: {
              _id: newPayment.propertyId,
              name: 'Loading...'
            }
          } as Payment
        ]);

        return { previousPayments };
      },
      onSuccess: (newPayment) => {
        queryClient.setQueryData<Payment[]>('payments', (old = []) => {
          const filtered = old.filter(p => !p._id.startsWith('temp-id-'));
          return [...filtered, newPayment];
        });
        notifications.show({
          title: 'Succès',
          message: 'Paiement créé avec succès',
          color: 'green',
        });
      },
      onError: (error: any) => {
        // Restaurer l'état précédent en cas d'erreur
        queryClient.setQueryData('payments', (context: any) => context?.previousPayments);
        notifications.show({
          title: 'Erreur',
          message: error.response?.data?.message || 'Erreur lors de la création du paiement',
          color: 'red',
        });
      },
      onSettled: () => {
        // Rafraîchir les données
        queryClient.invalidateQueries('payments');
      },
    }
  );

  const deletePaymentMutation = useMutation(deletePayment, {
    onSuccess: () => {
      queryClient.invalidateQueries('payments');
      notifications.show({
        title: 'Succès',
        message: 'Paiement supprimé avec succès',
        color: 'green',
      });
    },
  });

  return {
    payments,
    isLoading,
    addPayment: addPayment.mutate,
    deletePayment: deletePaymentMutation.mutate,
  };
} 