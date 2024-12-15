import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axiosInstance } from '../api/axios';
import { Tenant } from '../types/tenant';
import { notifications } from '@mantine/notifications';

export const getTenants = async (propertyId: string): Promise<Tenant[]> => {
  const { data } = await axiosInstance.get(`/tenants?propertyId=${propertyId}`);
  return data;
};

export const createTenant = async (tenant: Omit<Tenant, '_id'>): Promise<Tenant> => {
  try {
    const { data } = await axiosInstance.post('/tenants', tenant);
    return data;
  } catch (error: any) {
    console.error('Error in createTenant:', error.response?.data || error);
    throw error;
  }
};

export function useTenants(propertyId: string) {
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery(
    ['tenants', propertyId],
    () => getTenants(propertyId),
    {
      enabled: !!propertyId,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchInterval: (data) => {
        const hasPendingTenants = data?.some(tenant => tenant.status === 'pending');
        return hasPendingTenants ? 2000 : false;
      }
    }
  );

  const addTenant = useMutation(createTenant, {
    onMutate: async (newTenant) => {
      await queryClient.cancelQueries(['tenants', propertyId]);

      const previousTenants = queryClient.getQueryData(['tenants', propertyId]);

      queryClient.setQueryData(['tenants', propertyId], (old: Tenant[] = []) => [
        ...old,
        { ...newTenant, _id: 'temp-id' } as Tenant
      ]);

      return { previousTenants };
    },
    onSuccess: (newTenant) => {
      queryClient.setQueryData(['tenants', propertyId], (old: Tenant[] = []) => {
        const filteredTenants = old.filter(t => t._id !== 'temp-id');
        return [...filteredTenants, newTenant];
      });

      queryClient.invalidateQueries(['tenants', propertyId]);
      queryClient.invalidateQueries('properties');

      notifications.show({
        title: 'Succès',
        message: 'Le locataire a été créé avec succès',
        color: 'green'
      });
    },
    onError: (error: any, newTenant, context) => {
      if (context?.previousTenants) {
        queryClient.setQueryData(['tenants', propertyId], context.previousTenants);
      }

      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création du locataire';
      console.error('Tenant creation error:', error.response?.data || error);
      
      notifications.show({
        title: 'Erreur',
        message: errorMessage,
        color: 'red'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['tenants', propertyId]);
    }
  });

  return {
    tenants,
    isLoading,
    addTenant: addTenant.mutate,
    isCreating: addTenant.isLoading
  };
} 