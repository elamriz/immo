import { 
  Container, Title, Button, Group, Paper, Stack, Select,
  Table, ActionIcon, Text, Loader 
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import { useTenants } from '../hooks/useTenants';
import { AddTenantModal } from '../components/tenant/AddTenantModal';

export function Tenants() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  
  const { properties, isLoading: propertiesLoading } = useProperties();
  const { 
    tenants, 
    isLoading: tenantsLoading,
    createTenant,
    deleteTenant 
  } = useTenants(selectedPropertyId || '');

  const isLoading = propertiesLoading || tenantsLoading;

  if (isLoading) {
    return (
      <Container size="xl">
        <Stack align="center" spacing="xl" mt="xl">
          <Loader size="xl" />
          <Text>Chargement des données...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group position="apart" mb="xl">
        <Title>Locataires</Title>
        <Group>
          <Select
            placeholder="Sélectionner une propriété"
            data={properties.map(p => ({ value: p._id, label: p.name }))}
            value={selectedPropertyId}
            onChange={setSelectedPropertyId}
            style={{ width: 200 }}
            clearable
          />
          <Button 
            leftIcon={<IconPlus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={!selectedPropertyId}
          >
            Ajouter un locataire
          </Button>
        </Group>
      </Group>

      {!selectedPropertyId ? (
        <Paper p="xl" withBorder>
          <Stack align="center" spacing="md">
            <Text size="lg" weight={500}>Sélectionnez une propriété</Text>
            <Text color="dimmed">
              Veuillez sélectionner une propriété pour voir ses locataires
            </Text>
          </Stack>
        </Paper>
      ) : tenants.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" spacing="md">
            <Text size="lg" weight={500}>Aucun locataire</Text>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Ajouter mon premier locataire
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Paper withBorder>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nom</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Téléphone</Table.Th>
                <Table.Th>Début du bail</Table.Th>
                <Table.Th>Fin du bail</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tenants.map(tenant => (
                <Table.Tr key={tenant._id}>
                  <Table.Td>
                    {tenant.firstName} {tenant.lastName}
                  </Table.Td>
                  <Table.Td>{tenant.email}</Table.Td>
                  <Table.Td>{tenant.phone}</Table.Td>
                  <Table.Td>
                    {new Date(tenant.leaseStartDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    {new Date(tenant.leaseEndDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    <Group spacing={4}>
                      <ActionIcon color="blue" variant="light">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        color="red" 
                        variant="light"
                        onClick={() => deleteTenant(tenant._id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      {selectedPropertyId && (
        <AddTenantModal
          opened={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          propertyId={selectedPropertyId}
        />
      )}
    </Container>
  );
} 