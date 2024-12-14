import React from 'react';
import { Container, Title, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

// TODO: Créer ces types et API endpoints
interface Contractor {
  _id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
}

export function Contractors() {
  // TODO: Implémenter la logique de gestion des réparateurs
  const contractors: Contractor[] = [];

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title>Réparateurs</Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => {
            // TODO: Implémenter l'ajout de réparateur
          }}
        >
          Ajouter un réparateur
        </Button>
      </Group>

      {contractors.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="xl">
            <Title order={2}>Aucun réparateur</Title>
            <Text c="dimmed">
              Aucun réparateur n'a été ajouté pour le moment.
            </Text>
            <Button
              leftSection={<IconPlus size={20} />}
              onClick={() => {
                // TODO: Implémenter l'ajout de réparateur
              }}
            >
              Ajouter un réparateur
            </Button>
          </Stack>
        </Paper>
      ) : (
        // TODO: Implémenter l'affichage des réparateurs
        <Paper p="xl" withBorder>
          <Text>Liste des réparateurs à implémenter</Text>
        </Paper>
      )}
    </Container>
  );
} 