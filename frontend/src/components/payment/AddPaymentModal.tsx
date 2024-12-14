import { Modal, TextInput, NumberInput, Select, Button, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { CreatePaymentDto } from '../../types/payment';

interface AddPaymentModalProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (payment: CreatePaymentDto) => void;
  tenantId: string;
  propertyId: string;
}

export function AddPaymentModal({ opened, onClose, onAdd, tenantId, propertyId }: AddPaymentModalProps) {
  const form = useForm<CreatePaymentDto>({
    initialValues: {
      tenantId,
      propertyId,
      amount: 0,
      dueDate: new Date(),
      status: 'pending',
      paymentMethod: 'bank_transfer',
    },
    validate: {
      amount: (value) => (value <= 0 ? 'Le montant doit être supérieur à 0' : null),
      dueDate: (value) => (!value ? 'La date d\'échéance est requise' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onAdd(values);
    form.reset();
    onClose();
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Ajouter un paiement"
      size="md"
    >
      <form onSubmit={handleSubmit}>
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

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose}>Annuler</Button>
          <Button type="submit">Ajouter</Button>
        </Group>
      </form>
    </Modal>
  );
} 