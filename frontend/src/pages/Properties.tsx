import { 
  Container, Title, Button, Group, Paper, Stack, Text, 
  Badge, Menu, Select, Grid, Card, ActionIcon, Tooltip 
} from '@mantine/core';
import { 
  IconPlus, IconHome, IconUsers, IconTicket, IconReceipt,
  IconFilter, IconSortAscending, IconAlertCircle, IconCalendar,
  IconDotsVertical, IconEdit, IconTrash
} from '@tabler/icons-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notifications } from '@mantine/notifications';
import { getProperties, deleteProperty } from '../api/property';
import { Property } from '../types/property';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AddPropertyModal } from '../components/property/AddPropertyModal';
import { EditPropertyModal } from '../components/property/EditPropertyModal';

export function Properties() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'rentAmount'>('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const navigate = useNavigate();
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

  // Filtrer et trier les propriétés
  const filteredProperties = properties
    .filter(property => !statusFilter || property.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.rentAmount - a.rentAmount;
    });

  // Calculer les statistiques
  const totalRevenue = properties.reduce((sum, p) => sum + p.rentAmount, 0);
  const occupiedCount = properties.filter(p => p.status === 'occupied').length;
  const availableCount = properties.filter(p => p.status === 'available').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'blue';
      case 'available': return 'green';
      case 'maintenance': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied': return '🔵';
      case 'available': return '🟢';
      case 'maintenance': return '🟠';
      default: return '⚪';
    }
  };

  return (
    <Container size="xl">
      {/* En-tête avec statistiques */}
      <Grid mb="xl">
        <Grid.Col span={4}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed">Revenus mensuels</Text>
            <Title order={3}>{totalRevenue.toLocaleString('fr-FR')} €</Title>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed">Propriétés occupées</Text>
            <Title order={3}>{occupiedCount} / {properties.length}</Title>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper p="md" withBorder>
            <Text size="sm" c="dimmed">Propriétés disponibles</Text>
            <Title order={3}>{availableCount}</Title>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Barre d'actions */}
      <Group position="apart" mb="xl">
        <Group>
          <Select
            placeholder="Filtrer par statut"
            value={statusFilter}
            onChange={setStatusFilter}
            data={[
              { value: '', label: 'Tous les statuts' },
              { value: 'available', label: '🟢 Disponible' },
              { value: 'occupied', label: '🔵 Occupé' },
              { value: 'maintenance', label: '🟠 En maintenance' },
            ]}
            style={{ width: 200 }}
            icon={<IconFilter size={16} />}
            clearable
          />
          <Select
            placeholder="Trier par"
            value={sortBy}
            onChange={(value: 'name' | 'rentAmount') => setSortBy(value)}
            data={[
              { value: 'name', label: 'Nom' },
              { value: 'rentAmount', label: 'Loyer' },
            ]}
            style={{ width: 150 }}
            icon={<IconSortAscending size={16} />}
          />
        </Group>
        <Button
          leftIcon={<IconPlus size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Ajouter une propriété
        </Button>
      </Group>

      {/* Liste des propriétés */}
      <Grid>
        {filteredProperties.map((property) => (
          <Grid.Col key={property._id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section p="md" bg="gray.0">
                <Group position="apart">
                  <Group>
                    <IconHome size={20} />
                    <Text fw={500}>{property.name}</Text>
                  </Group>
                  <Badge 
                    color={getStatusColor(property.status)}
                    leftSection={getStatusIcon(property.status)}
                  >
                    {property.status === 'occupied' ? 'Occupé' : 
                     property.status === 'available' ? 'Disponible' : 'Maintenance'}
                  </Badge>
                </Group>
              </Card.Section>

              <Stack spacing="xs" mt="md">
                <Text size="sm" c="dimmed">{property.address}</Text>
                <Group position="apart">
                  <Text size="sm">{property.size}m² • {property.numberOfRooms} pièces</Text>
                  <Text fw={500}>{property.rentAmount}€/mois</Text>
                </Group>

                {property.status === 'occupied' && property.tenants?.length > 0 && (
                  <Group spacing="xs">
                    <IconCalendar size={16} />
                    <Text size="sm">
                      Bail: {format(new Date(property.tenants[0].leaseStartDate), 'dd/MM/yyyy', { locale: fr })}
                      {' → '}
                      {format(new Date(property.tenants[0].leaseEndDate), 'dd/MM/yyyy', { locale: fr })}
                    </Text>
                  </Group>
                )}

                {property.amenities?.length > 0 && (
                  <Group mt="xs">
                    {property.amenities.map((amenity) => (
                      <Badge key={amenity} variant="light" size="sm">
                        {amenity}
                      </Badge>
                    ))}
                  </Group>
                )}
              </Stack>

              <Group position="apart" mt="md">
                <Group spacing={8}>
                  <Tooltip label="Voir les locataires">
                    <ActionIcon 
                      variant="light"
                      onClick={() => navigate(`/properties/${property._id}/tenants`)}
                    >
                      <IconUsers size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Voir les tickets">
                    <ActionIcon 
                      variant="light"
                      onClick={() => navigate(`/properties/${property._id}/tickets`)}
                    >
                      <IconTicket size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Ajouter un paiement">
                    <ActionIcon 
                      variant="light"
                      onClick={() => navigate(`/properties/${property._id}/payments/new`)}
                    >
                      <IconReceipt size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Menu position="bottom-end">
                  <Menu.Target>
                    <ActionIcon>
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item 
                      icon={<IconEdit size={14} />}
                      onClick={() => setEditingProperty(property)}
                    >
                      Modifier
                    </Menu.Item>
                    <Menu.Item 
                      icon={<IconTrash size={14} />}
                      color="red"
                      onClick={() => deleteMutation.mutate(property._id)}
                    >
                      Supprimer
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Modals */}
      <AddPropertyModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          opened={!!editingProperty}
          onClose={() => setEditingProperty(null)}
        />
      )}
    </Container>
  );
} 