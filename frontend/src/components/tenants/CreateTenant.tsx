import { useMutation, useQueryClient } from 'react-query';
import { axiosInstance } from '../../api/axios';

export function CreateTenant() {
  const queryClient = useQueryClient();
  const form = useForm({
    // ... configuration du formulaire
  });

  const createTenant = useMutation(
    async (values: typeof form.values) => {
      const { data } = await axiosInstance.post('/tenants', values);
      return data;
    },
    {
      onSuccess: () => {
        // Invalider les queries pour forcer le rechargement des données
        queryClient.invalidateQueries('tenants');
        queryClient.invalidateQueries('properties');
        form.reset();
        // Fermer le modal ou faire d'autres actions nécessaires
      }
    }
  );

  const handleSubmit = form.onSubmit((values) => {
    createTenant.mutate(values);
  });

  // ... reste du composant
} 