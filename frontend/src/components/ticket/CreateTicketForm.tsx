import { TextInput, Textarea, Select, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from 'react-query';
import { notifications } from '@mantine/notifications';
import { ContractorSelection } from './ContractorSelection';
import { createTicket } from '../../api/ticket';
import { getTenants } from '../../api/tenant';

interface CreateTicketFormProps {
  propertyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTicketForm({ propertyId, onSuccess, onCancel }: CreateTicketFormProps) {
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium',
      ticketType: 'general',
      tenantId: null as string | null,
      contractorId: null as string | null,
    },
    validate: {
      title: (value) => (!value ? 'Le titre est requis' : null),
      description: (value) => (!value ? 'La description est requise' : null),
      tenantId: (value, values) => 
        values.ticketType === 'tenant_specific' && !value 
          ? 'Le locataire est requis pour un ticket spécifique' 
          : null,
    },
  });

  // Récupérer les locataires de la propriété
  const { data: tenants = [] } = useQuery(
    ['tenants', propertyId],
    () => getTenants(propertyId),
    {
      enabled: !!propertyId,
    }
  );

  const mutation = useMutation(createTicket, {
    onSuccess: () => {
      notifications.show({
        title: 'Succès',
        message: 'Le ticket a été créé avec succès',
        color: 'green',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.response?.data?.message || 'Une erreur est survenue',
        color: 'red',
      });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log('Form values before submission:', values);
    
    const ticketData = {
      ...values,
      propertyId,
      contractorId: values.contractorId || undefined,
    };

    console.log('Ticket data to be sent:', ticketData);
    mutation.mutate(ticketData);
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="md">
        <TextInput
          required
          label="Titre"
          placeholder="Ex: Fuite d'eau dans la salle de bain"
          {...form.getInputProps('title')}
        />

        <Textarea
          required
          label="Description"
          placeholder="Décrivez le problème en détail"
          minRows={3}
          {...form.getInputProps('description')}
        />

        <Select
          label="Type de ticket"
          data={[
            { value: 'general', label: 'Général' },
            { value: 'tenant_specific', label: 'Spécifique au locataire' },
          ]}
          {...form.getInputProps('ticketType')}
        />

        {form.values.ticketType === 'tenant_specific' && (
          <Select
            required
            label="Locataire"
            placeholder="Sélectionner le locataire concerné"
            data={tenants.map(tenant => ({
              value: tenant._id,
              label: `${tenant.firstName} ${tenant.lastName}`,
            }))}
            {...form.getInputProps('tenantId')}
          />
        )}

        <Select
          label="Priorité"
          data={[
            { value: 'low', label: 'Basse' },
            { value: 'medium', label: 'Moyenne' },
            { value: 'high', label: 'Haute' },
          ]}
          {...form.getInputProps('priority')}
        />

        <ContractorSelection
          onSelect={(contractorId) => form.setFieldValue('contractorId', contractorId)}
          selectedContractorId={form.values.contractorId}
        />

        <Group justify="flex-end" mt="xl">
          {onCancel && (
            <Button variant="light" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" loading={mutation.isLoading}>
            Créer le ticket
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 