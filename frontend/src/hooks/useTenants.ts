import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createTenant, getTenants, updateTenant, deleteTenant } from '../api/tenant';
import { notifications } from '@mantine/notifications';
import { CreateTenantDto } from '../types/tenant';

export const useTenants = (propertyId: string) => {
  const queryClient = useQueryClient();

  // Requête pour récupérer les locataires
  const {
    data: tenants = [],
    isLoading,
    error
  } = useQuery(
    ['tenants', propertyId],
    () => getTenants(propertyId),
    {
      enabled: !!propertyId,
      refetchOnWindowFocus: true
    }
  );

  // Mutation pour créer un locataire
  const createTenantMutation = useMutation(
    (data: CreateTenantDto) => createTenant(propertyId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tenants', propertyId]);
        notifications.show({
          title: 'Succès',
          message: 'Locataire ajouté avec succès',
          color: 'green'
        });
      },
      onError: (error: any) => {
        console.error('Error in createTenant:', error.response?.data || error);
        notifications.show({
          title: 'Erreur',
          message: error.response?.data?.message || 'Erreur lors de l\'ajout du locataire',
          color: 'red'
        });
      }
    }
  );

  // Mutation pour mettre à jour un locataire
  const updateTenantMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<CreateTenantDto> }) => 
      updateTenant(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tenants', propertyId]);
        notifications.show({
          title: 'Succès',
          message: 'Locataire mis à jour avec succès',
          color: 'green'
        });
      }
    }
  );

  // Mutation pour supprimer un locataire
  const deleteTenantMutation = useMutation(
    (id: string) => deleteTenant(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tenants', propertyId]);
        notifications.show({
          title: 'Succès',
          message: 'Locataire supprimé avec succès',
          color: 'green'
        });
      }
    }
  );

  return {
    tenants,
    isLoading,
    error,
    createTenant: createTenantMutation.mutate,
    updateTenant: updateTenantMutation.mutate,
    deleteTenant: deleteTenantMutation.mutate,
    isCreating: createTenantMutation.isLoading,
    isUpdating: updateTenantMutation.isLoading,
    isDeleting: deleteTenantMutation.isLoading
  };
}; 