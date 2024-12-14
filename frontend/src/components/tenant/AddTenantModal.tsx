import { Modal, TextInput, NumberInput, Button, Group, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { CreateTenantDto } from '../../types/tenant';

interface AddTenantModalProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (tenant: CreateTenantDto) => void;
  propertyId: string;
}

export function AddTenantModal({ opened, onClose, onAdd, propertyId }: AddTenantModalProps) {
  const form = useForm<CreateTenantDto>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      propertyId: propertyId,
      leaseStartDate: new Date(),
      leaseEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rentAmount: 0,
      depositAmount: 0,
      status: 'pending',
      rentStatus: 'pending',
    },
    validate: {
      firstName: (value) => (!value ? 'Le prénom est requis' : null),
      lastName: (value) => (!value ? 'Le nom est requis' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      phone: (value) => (!value ? 'Le téléphone est requis' : null),
      rentAmount: (value) => (value <= 0 ? 'Le montant du loyer doit être supérieur à 0' : null),
      depositAmount: (value) => (value <= 0 ? 'Le montant de la caution doit être supérieur à 0' : null),
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
      title="Ajouter un locataire"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Group grow>
          <TextInput
            required
            label="Prénom"
            placeholder="Jean"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            required
            label="Nom"
            placeholder="Dupont"
            {...form.getInputProps('lastName')}
          />
        </Group>

        <Group grow mt="md">
          <TextInput
            required
            label="Email"
            placeholder="jean.dupont@example.com"
            {...form.getInputProps('email')}
          />
          <TextInput
            required
            label="Téléphone"
            placeholder="0612345678"
            {...form.getInputProps('phone')}
          />
        </Group>

        <Group grow mt="md">
          <DateInput
            required
            label="Début du bail"
            {...form.getInputProps('leaseStartDate')}
          />
          <DateInput
            required
            label="Fin du bail"
            minDate={new Date(form.values.leaseStartDate)}
            {...form.getInputProps('leaseEndDate')}
          />
        </Group>

        <Group grow mt="md">
          <NumberInput
            required
            label="Loyer mensuel"
            suffix=" €"
            min={0}
            {...form.getInputProps('rentAmount')}
          />
          <NumberInput
            required
            label="Dépôt de garantie"
            suffix=" €"
            min={0}
            {...form.getInputProps('depositAmount')}
          />
        </Group>

        <Select
          mt="md"
          label="Statut"
          data={[
            { value: 'pending', label: 'En attente' },
            { value: 'active', label: 'Actif' },
            { value: 'ended', label: 'Terminé' },
          ]}
          {...form.getInputProps('status')}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose}>Annuler</Button>
          <Button type="submit">Ajouter</Button>
        </Group>
      </form>
    </Modal>
  );
} 