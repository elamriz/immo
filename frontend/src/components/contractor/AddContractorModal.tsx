import { Modal, TextInput, Button, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from 'react-query';
import { notifications } from '@mantine/notifications';
import { createContractor } from '../../api/contractor';
import { CreateContractorDto } from '../../types/contractor';

interface AddContractorModalProps {
  opened: boolean;
  onClose: () => void;
}

export function AddContractorModal({ opened, onClose }: AddContractorModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateContractorDto>({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      specialty: '',
      location: '',
    },
    validate: {
      name: (value) => (!value ? 'Le nom est requis' : null),
      phone: (value) => (!value ? 'Le téléphone est requis' : null),
      specialty: (value) => (!value ? 'La spécialité est requise' : null),
    },
  });

  const mutation = useMutation(createContractor, {
    onSuccess: () => {
      queryClient.invalidateQueries('contractors');
      notifications.show({
        title: 'Succès',
        message: 'Réparateur ajouté avec succès',
        color: 'green',
      });
      onClose();
      form.reset();
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Ajouter un réparateur"
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
          <Button type="submit" loading={mutation.isLoading}>
            Ajouter
          </Button>
        </Group>
      </form>
    </Modal>
  );
} 