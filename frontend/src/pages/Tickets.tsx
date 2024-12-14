import { Container, Title, Button, Group, Paper, Stack, Text, Select } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notifications } from '@mantine/notifications';
import { useProperties } from '../hooks/useProperties';

// TODO: Créer ces types et API endpoints
interface Ticket {
  _id: string;
  propertyId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export function Tickets() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const { properties } = useProperties();

  // TODO: Implémenter la logique de gestion des tickets
  const tickets: Ticket[] = [];

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title>Tickets</Title>
        <Group>
          <Select
            placeholder="Sélectionner une propriété"
            data={properties.map(p => ({ value: p._id, label: p.name }))}
            value={selectedPropertyId}
            onChange={setSelectedPropertyId}
            clearable
          />
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={() => {
              // TODO: Implémenter l'ajout de ticket
            }}
            disabled={!selectedPropertyId}
          >
            Nouveau ticket
          </Button>
        </Group>
      </Group>

      {tickets.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="xl">
            <Title order={2}>Aucun ticket</Title>
            <Text c="dimmed">
              Aucun ticket n'a été créé pour le moment.
            </Text>
            <Button
              leftSection={<IconPlus size={20} />}
              onClick={() => {
                // TODO: Implémenter l'ajout de ticket
              }}
              disabled={!selectedPropertyId}
            >
              Créer un ticket
            </Button>
          </Stack>
        </Paper>
      ) : (
        // TODO: Implémenter l'affichage des tickets
        <Paper p="xl" withBorder>
          <Text>Liste des tickets à implémenter</Text>
        </Paper>
      )}
    </Container>
  );
} 