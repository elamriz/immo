import { Card, Grid, Text, Group, Stack, Button, Badge, Tabs } from '@mantine/core';
import { IconEdit, IconUsers, IconReceipt, IconTicket } from '@tabler/icons-react';
import { Property } from '../../types/property';
import { TenantList } from '../tenant/TenantList';
import { useState } from 'react';
import { EditPropertyModal } from './EditPropertyModal';

interface PropertyDetailsProps {
  property: Property;
  onUpdate: (property: Property) => void;
}

export function PropertyDetails({ property, onUpdate }: PropertyDetailsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <Card withBorder>
        <Group justify="space-between" mb="xl">
          <Stack gap="xs">
            <Text size="xl" fw={700}>{property.name}</Text>
            <Text c="dimmed">{property.address}</Text>
          </Stack>
          <Button 
            leftSection={<IconEdit size={16} />}
            variant="light"
            onClick={() => setIsEditModalOpen(true)}
          >
            Modifier
          </Button>
        </Group>

        <Tabs defaultValue="details">
          <Tabs.List>
            <Tabs.Tab value="details" leftSection={<IconUsers size={16} />}>
              Détails
            </Tabs.Tab>
            <Tabs.Tab value="tenants" leftSection={<IconUsers size={16} />}>
              Locataires
            </Tabs.Tab>
            <Tabs.Tab value="payments" leftSection={<IconReceipt size={16} />}>
              Paiements
            </Tabs.Tab>
            <Tabs.Tab value="tickets" leftSection={<IconTicket size={16} />}>
              Tickets
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="xl">
            <Grid>
              <Grid.Col span={6}>
                <Stack gap="md">
                  <Group>
                    <Text fw={500}>Type:</Text>
                    <Text>{property.type}</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Surface:</Text>
                    <Text>{property.size} m²</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Nombre de pièces:</Text>
                    <Text>{property.numberOfRooms}</Text>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="md">
                  <Group>
                    <Text fw={500}>Loyer mensuel:</Text>
                    <Text>{property.rentAmount} €</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Capacité maximale:</Text>
                    <Text>{property.maxTenants} locataires</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Statut:</Text>
                    <Badge color={property.status === 'available' ? 'green' : 'blue'}>
                      {property.status === 'available' ? 'Disponible' : 'Occupé'}
                    </Badge>
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="tenants" pt="xl">
            <TenantList propertyId={property._id} />
          </Tabs.Panel>

          {/* Autres panels à implémenter */}
        </Tabs>
      </Card>

      <EditPropertyModal
        property={property}
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
} 