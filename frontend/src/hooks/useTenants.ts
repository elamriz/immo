import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTenants, createTenant, updateTenant, deleteTenant } from '../api/tenant';
import { notifications } from '@mantine/notifications';

export function useTenants(propertyId: string | null) {
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery(
    ['tenants', propertyId],
    () => getTenants(propertyId!),
    {
      enabled: !!propertyId,
    }
  );

  const updateMutation = useMutation(updateTenant, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tenants', propertyId]);
      notifications.show({
        title: 'Success',
        message: 'Tenant updated successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update tenant',
        color: 'red',
      });
    },
  });

  const addMutation = useMutation(createTenant, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tenants', propertyId]);
      notifications.show({
        title: 'Success',
        message: 'Tenant added successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to add tenant',
        color: 'red',
      });
    },
  });

  const deleteMutation = useMutation(deleteTenant, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tenants', propertyId]);
      notifications.show({
        title: 'Success',
        message: 'Tenant deleted successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete tenant',
        color: 'red',
      });
    },
  });

  return {
    tenants,
    isLoading,
    updateTenant: updateMutation.mutate,
    addTenant: addMutation.mutate,
    deleteTenant: deleteMutation.mutate,
  };
} 