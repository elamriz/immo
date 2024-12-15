import { Modal, TextInput, Button, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from 'react-query';
import { notifications } from '@mantine/notifications';
import { updateContractor } from '../../api/contractor';
import { Contractor } from '../../types/contractor';

interface EditContractorModalProps {
  contractor: Contractor;
  opened: boolean;
  onClose: () => void;
}

export function EditContractorModal({ contractor, opened, onClose }: EditContractorModalProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: contractor.name,
      phone: contractor.phone,
      email: contractor.email || '',
      specialty: contractor.specialty,
      location: contractor.location || '',
    },
    validate: {
      name: (value) => (!value ? 'Le nom est requis' : null),
      phone: (value) => (!value ? 'Le téléphone est requis' : null),
      specialty: (value) => (!value ? 'La spécialité est requise' : null),
    },
  });

  const mutation = useMutation(
    (values: Partial<Contractor>) => updateContractor(contractor._id, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contractors');
        notifications.show({
          title: 'Succès',
          message: 'Réparateur modifié avec succès',
          color: 'green',
        });
        onClose();
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Erreur',
          message: error.response?.data?.message || 'Une erreur est survenue',
          color: 'red',
        });
      },
    }
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Modifier le réparateur"
      size="md"
    >
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <TextInput
          required
          label="Nom"
          placeholder="Nom complet"
          {...form.getInputProps('name')}
        />
        <TextInput
          required
          label="Téléphone"
          placeholder="Numéro de téléphone"
          mt="md"
          {...form.getInputProps('phone')}
        />
        <TextInput
          label="Email"
          placeholder="Adresse email"
          mt="md"
          {...form.getInputProps('email')}
        />
        <Select
          required
          label="Spécialité"
          placeholder="Sélectionner une spécialité"
          data={[
            { value: 'plomberie', label: 'Plomberie' },
            { value: 'electricite', label: 'Électricité' },
            { value: 'chauffage', label: 'Chauffage' },
            { value: 'serrurerie', label: 'Serrurerie' },
            { value: 'menuiserie', label: 'Menuiserie' },
            { value: 'peinture', label: 'Peinture' },
          ]}
          mt="md"
          {...form.getInputProps('specialty')}
        />
        <TextInput
          label="Localisation"
          placeholder="Ville ou code postal"
          mt="md"
          {...form.getInputProps('location')}
        />
        <Group position="right" mt="xl">
          <Button variant="light" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            loading={mutation.isLoading}
            color="blue"
          >
            Enregistrer
          </Button>
        </Group>
      </form>
    </Modal>
  );
} 