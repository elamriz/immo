import { Container, Title, Button, Group, Paper, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notifications } from '@mantine/notifications';
import { getProperties, deleteProperty } from '../api/property';
import { PropertyList } from '../components/property/PropertyList';
import { AddPropertyModal } from '../components/property/AddPropertyModal';
import { Property } from '../types/property';

export function Properties() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery('properties', getProperties);

  const deleteMutation = useMutation(deleteProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries('properties');
      notifications.show({
        title: 'Succès',
        message: 'Propriété supprimée avec succès',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression',
        color: 'red',
      });
    },
  });

  if (isLoading) {
    return (
      <Container size="xl">
        <Title>Chargement...</Title>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title>Mes Propriétés</Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Ajouter une propriété
        </Button>
      </Group>

      {properties.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="xl">
            <Title order={2}>Aucune propriété</Title>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              leftSection={<IconPlus size={20} />}
            >
              Ajouter ma première propriété
            </Button>
          </Stack>
        </Paper>
      ) : (
        <PropertyList
          properties={properties}
          onUpdate={(updatedProperty) => {
            queryClient.setQueryData('properties', (old: Property[] = []) =>
              old.map((p) => (p._id === updatedProperty._id ? updatedProperty : p))
            );
          }}
          onDelete={(id) => {
            deleteMutation.mutate(id);
          }}
        />
      )}

      <AddPropertyModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newProperty) => {
          queryClient.setQueryData('properties', (old: Property[] = []) => [...old, newProperty]);
          setIsAddModalOpen(false);
        }}
      />
    </Container>
  );
} 