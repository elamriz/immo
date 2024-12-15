import { 
  Modal, TextInput, NumberInput, Button, Group, Stack
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { CreateTenantDto } from '../../types/tenant';
import { useTenants } from '../../hooks/useTenants';

interface AddTenantModalProps {
  opened: boolean;
  onClose: () => void;
  propertyId: string;
}

export function AddTenantModal({ opened, onClose, propertyId }: AddTenantModalProps) {
  const { createTenant } = useTenants(propertyId);

  const form = useForm<CreateTenantDto>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      leaseStartDate: new Date(),
      leaseEndDate: new Date(),
      rentAmount: 0,
      depositAmount: 0,
      propertyId
    },
    validate: {
      firstName: (value) => (!value ? 'Le prénom est requis' : null),
      lastName: (value) => (!value ? 'Le nom est requis' : null),
      email: (value) => {
        if (!value) return 'L\'email est requis';
        if (!/^\S+@\S+$/.test(value)) return 'Email invalide';
        return null;
      },
      phone: (value) => (!value ? 'Le téléphone est requis' : null),
      rentAmount: (value) => (value <= 0 ? 'Le loyer doit être supérieur à 0' : null),
      depositAmount: (value) => (value <= 0 ? 'Le dépôt de garantie doit être supérieur à 0' : null),
    }
  });

  const handleSubmit = form.onSubmit((values) => {
    try {
      // Convertir les dates en objets Date
      const tenant = {
        ...values,
        leaseStartDate: new Date(values.leaseStartDate),
        leaseEndDate: new Date(values.leaseEndDate)
      };
      
      createTenant(tenant);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating tenant:', error);
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Ajouter un locataire"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <Group grow>
            <TextInput
              required
              label="Prénom"
              placeholder="John"
              {...form.getInputProps('firstName')}
            />
            <TextInput
              required
              label="Nom"
              placeholder="Doe"
              {...form.getInputProps('lastName')}
            />
          </Group>

          <TextInput
            required
            label="Email"
            description="Le locataire pourra créer son compte avec cet email"
            placeholder="john.doe@example.com"
            {...form.getInputProps('email')}
          />

          <TextInput
            required
            label="Téléphone"
            placeholder="06 12 34 56 78"
            {...form.getInputProps('phone')}
          />

          <Group grow>
            <DateInput
              required
              label="Début du bail"
              placeholder="Date de début"
              {...form.getInputProps('leaseStartDate')}
            />
            <DateInput
              required
              label="Fin du bail"
              placeholder="Date de fin"
              minDate={form.values.leaseStartDate}
              {...form.getInputProps('leaseEndDate')}
            />
          </Group>

          <Group grow>
            <NumberInput
              required
              label="Loyer mensuel"
              placeholder="0.00"
              precision={2}
              min={0}
              {...form.getInputProps('rentAmount')}
            />
            <NumberInput
              required
              label="Dépôt de garantie"
              placeholder="0.00"
              precision={2}
              min={0}
              {...form.getInputProps('depositAmount')}
            />
          </Group>

          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={onClose}>Annuler</Button>
            <Button type="submit">Ajouter</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 