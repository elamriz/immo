import { Select, Button, Modal, TextInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getContractors, createContractor } from '../../api/contractor';
import { CreateContractorDto } from '../../types/contractor';

interface ContractorSelectionProps {
  onSelect: (contractorId: string | null) => void;
  selectedContractorId?: string;
}

export function ContractorSelection({ onSelect, selectedContractorId }: ContractorSelectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: contractors = [] } = useQuery('contractors', getContractors);

  const createMutation = useMutation(createContractor, {
    onSuccess: (newContractor) => {
      queryClient.invalidateQueries('contractors');
      onSelect(newContractor._id);
      setIsModalOpen(false);
    },
  });

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

  const handleCreateContractor = form.onSubmit((values) => {
    createMutation.mutate(values);
  });

  return (
    <>
      <Stack>
        <Select
          label="Réparateur"
          placeholder="Sélectionner un réparateur"
          data={contractors.map((c) => ({
            value: c._id,
            label: `${c.name} (${c.specialty} - ${c.location || 'N/A'})`,
          }))}
          value={selectedContractorId}
          onChange={(value) => onSelect(value)}
          clearable
        />
        <Button variant="light" onClick={() => setIsModalOpen(true)}>
          Créer un nouveau réparateur
        </Button>
      </Stack>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un réparateur"
      >
        <form onSubmit={handleCreateContractor}>
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
          <TextInput
            required
            label="Spécialité"
            placeholder="Ex: Plomberie, Électricité"
            mt="md"
            {...form.getInputProps('specialty')}
          />
          <TextInput
            label="Zone géographique"
            placeholder="Ville ou code postal"
            mt="md"
            {...form.getInputProps('location')}
          />
          <Button type="submit" mt="xl" loading={createMutation.isLoading}>
            Créer le réparateur
          </Button>
        </form>
      </Modal>
    </>
  );
} 