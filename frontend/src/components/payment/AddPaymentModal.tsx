import { Modal, TextInput, NumberInput, Select, Button, Group, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { CreatePaymentDto } from '../../types/payment';
import { useQuery, useQueryClient } from 'react-query';
import { getProperty } from '../../api/property';
import { getTenants } from '../../api/tenant';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { createPayment } from '../../api/payment';
import { notifications } from '@mantine/notifications';

interface AddPaymentModalProps {
  opened: boolean;
  onClose: () => void;
  propertyId: string;
}

export function AddPaymentModal({ opened, onClose, propertyId }: AddPaymentModalProps) {
  const queryClient = useQueryClient();
  const { data: property } = useQuery(['property', propertyId], () => getProperty(propertyId));
  const { data: tenants = [] } = useQuery(
    ['tenants', propertyId],
    () => getTenants(propertyId),
    { enabled: !!propertyId }
  );

  const createPaymentMutation = useMutation(createPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['payments', propertyId]);
      notifications.show({
        title: 'Succès',
        message: 'Paiement créé avec succès',
        color: 'green'
      });
      onClose();
    }
  });

  const form = useForm<CreatePaymentDto>({
    initialValues: {
      tenantId: '',
      propertyId,
      amount: 0,
      dueDate: new Date(),
      status: 'pending',
      paymentMethod: 'bank_transfer',
      isCoLivingShare: false,
      shareDetails: {
        percentage: 0,
        totalRent: 0,
        commonCharges: {}
      }
    },
    validate: {
      tenantId: (value) => (!value ? 'Sélectionnez un locataire' : null),
      amount: (value) => (value <= 0 ? 'Le montant doit être supérieur à 0' : null),
    },
  });

  useEffect(() => {
    if (property?.isCoLiving) {
      form.setFieldValue('isCoLivingShare', true);
      form.setFieldValue('shareDetails.totalRent', property.coLivingDetails?.totalRent || 0);
      
      // Pré-remplir les charges communes
      if (property.coLivingDetails?.commonCharges) {
        form.setFieldValue('shareDetails.commonCharges', property.coLivingDetails.commonCharges);
      }
    }
  }, [property]);

  const handleSubmit = form.onSubmit((values) => {
    createPaymentMutation.mutate(values);
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Ajouter un paiement"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Select
          required
          label="Locataire"
          data={tenants.map(t => ({
            value: t._id,
            label: `${t.firstName} ${t.lastName}`
          }))}
          {...form.getInputProps('tenantId')}
        />

        <NumberInput
          required
          label="Montant"
          placeholder="0.00"
          min={0}
          step={0.01}
          precision={2}
          {...form.getInputProps('amount')}
        />

        <DateInput
          required
          label="Date d'échéance"
          mt="md"
          {...form.getInputProps('dueDate')}
        />

        <Select
          label="Méthode de paiement"
          mt="md"
          data={[
            { value: 'bank_transfer', label: 'Virement bancaire' },
            { value: 'cash', label: 'Espèces' },
            { value: 'check', label: 'Chèque' },
          ]}
          {...form.getInputProps('paymentMethod')}
        />

        <TextInput
          label="Référence"
          placeholder="Numéro de référence (optionnel)"
          mt="md"
          {...form.getInputProps('reference')}
        />

        {property?.isCoLiving && (
          <>
            <NumberInput
              required
              label="Part du loyer (%)"
              min={0}
              max={100}
              {...form.getInputProps('shareDetails.percentage')}
            />
            
            <Text size="sm" weight={500} mt="md">Charges communes</Text>
            <Group grow>
              {Object.entries(form.values.shareDetails.commonCharges).map(([key, value]) => (
                <NumberInput
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  {...form.getInputProps(`shareDetails.commonCharges.${key}`)}
                />
              ))}
            </Group>
          </>
        )}

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose}>Annuler</Button>
          <Button type="submit">Ajouter</Button>
        </Group>
      </form>
    </Modal>
  );
} 