import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notifications } from '@mantine/notifications';
import { getTenants, createTenant, updateTenant, deleteTenant } from '../api/tenant';
import { Tenant, CreateTenantDto } from '../types/tenant';

export function useTenants(propertyId: string | null) {
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery(
    ['tenants', propertyId],
    () => propertyId ? getTenants(propertyId) : Promise.resolve([]),
    {
      enabled: !!propertyId
    }
  );

  const addTenant = useMutation(
    (newTenant: CreateTenantDto) => createTenant(newTenant),
    {
      onSuccess: (tenant) => {
        queryClient.setQueryData(['tenants', tenant.propertyId], 
          (old: Tenant[] = []) => [...old, tenant]
        );
        notifications.show({
          title: 'Succès',
          message: 'Locataire ajouté avec succès',
          color: 'green',
        });
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Erreur',
          message: error.response?.data?.message || 'Erreur lors de l\'ajout du locataire',
          color: 'red',
        });
      },
    }
  );

  const updateTenantMutation = useMutation(
    (data: { id: string; tenant: Partial<Tenant> }) => 
      updateTenant(data.id, data.tenant),
    {
      onSuccess: (updatedTenant) => {
        queryClient.setQueryData(['tenants', updatedTenant.propertyId],
          (old: Tenant[] = []) => old.map(t => 
            t._id === updatedTenant._id ? updatedTenant : t
          )
        );
        notifications.show({
          title: 'Succès',
          message: 'Locataire mis à jour avec succès',
          color: 'green',
        });
      },
    }
  );

  const deleteTenantMutation = useMutation(
    (id: string) => deleteTenant(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tenants', propertyId]);
        notifications.show({
          title: 'Succès',
          message: 'Locataire supprimé avec succès',
          color: 'green',
        });
      },
    }
  );

  return {
    tenants,
    isLoading,
    addTenant: addTenant.mutate,
    updateTenant: updateTenantMutation.mutate,
    deleteTenant: deleteTenantMutation.mutate,
  };
} 