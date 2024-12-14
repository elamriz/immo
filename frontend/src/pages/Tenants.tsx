import { Container, Title, Button, Group, Paper, Stack, Select } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useProperties } from '../hooks/useProperties';
import { useTenants } from '../hooks/useTenants';
import { TenantList } from '../components/tenant/TenantList';
import { AddTenantModal } from '../components/tenant/AddTenantModal';

export function Tenants() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const { properties } = useProperties();
  const { tenants, isLoading, addTenant, updateTenant, deleteTenant } = useTenants(selectedPropertyId);

  const handlePropertyChange = (value: string | null) => {
    setSelectedPropertyId(value);
  };

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
        <Title>Locataires</Title>
        <Group>
          <Select
            placeholder="Sélectionner une propriété"
            data={properties.map(p => ({ value: p._id, label: p.name }))}
            value={selectedPropertyId}
            onChange={handlePropertyChange}
            clearable
          />
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={!selectedPropertyId}
          >
            Ajouter un locataire
          </Button>
        </Group>
      </Group>

      {tenants.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="xl">
            <Title order={2}>Aucun locataire</Title>
            <Button
              leftSection={<IconPlus size={20} />}
              onClick={() => setIsAddModalOpen(true)}
              disabled={!selectedPropertyId}
            >
              Ajouter mon premier locataire
            </Button>
          </Stack>
        </Paper>
      ) : (
        <TenantList
          tenants={tenants}
          onUpdate={(tenant) => {
            updateTenant({ id: tenant._id, tenant });
          }}
          onDelete={deleteTenant}
        />
      )}

      {selectedPropertyId && (
        <AddTenantModal
          opened={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          propertyId={selectedPropertyId}
          onAdd={addTenant}
        />
      )}
    </Container>
  );
} 