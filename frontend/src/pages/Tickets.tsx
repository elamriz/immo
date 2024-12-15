import { 
  Container, Title, Button, Group, Paper, Stack, Text, Select, 
  Badge, Grid, Card, Avatar, Timeline, ActionIcon, Menu, Divider 
} from '@mantine/core';
import { 
  IconPlus, IconSortDescending, IconAlertTriangle, IconClock, 
  IconUser, IconBuilding, IconDotsVertical, IconCheck, IconX,
  IconEdit, IconTrash, IconPrinter, IconShare 
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect, useMemo } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useForm } from '@mantine/form';
import { useQuery } from 'react-query';
import { getProperties, getTenants } from '../api/properties';
import { Property } from '../types/property';
import { Tenant } from '../types/tenant';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  ticketType: 'general' | 'tenant_specific';
  propertyId: {
    _id: string;
    name: string;
  };
  tenantId?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  tenantInfo?: {
    firstName: string;
    lastName: string;
  };
  assignedContractor?: {
    _id: string;
    name: string;
    specialty: string;
  };
}

function TicketCard({ ticket, onStatusChange, onDelete }: { 
  ticket: Ticket; 
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'blue';
      case 'in_progress': return 'yellow';
      case 'resolved': return 'green';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <IconClock size={16} />;
      case 'in_progress': return <IconUser size={16} />;
      case 'resolved': return <IconCheck size={16} />;
      default: return null;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section p="md" bg="gray.0">
        <Group position="apart">
          <Group>
            <Badge 
              color={getPriorityColor(ticket.priority)}
              variant="filled"
              size="lg"
            >
              {ticket.priority.toUpperCase()}
            </Badge>
            <Text fw={500} size="lg">{ticket.title}</Text>
          </Group>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconEdit size={14} />}>Modifier</Menu.Item>
              <Menu.Item icon={<IconPrinter size={14} />}>Imprimer</Menu.Item>
              <Menu.Item icon={<IconShare size={14} />}>Partager</Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                color="red" 
                icon={<IconTrash size={14} />}
                onClick={() => onDelete(ticket._id)}
              >
                Supprimer
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Stack spacing="md" mt="md">
        <Group position="apart">
          <Group spacing="xs">
            <IconBuilding size={16} />
            <Text size="sm">{ticket.propertyId.name}</Text>
          </Group>
          <Badge 
            color={getStatusColor(ticket.status)}
            variant="light"
            leftSection={getStatusIcon(ticket.status)}
          >
            {ticket.status}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          {ticket.description}
        </Text>

        {ticket.ticketType === 'tenant_specific' && ticket.tenantInfo && (
          <Group spacing="xs">
            <Avatar 
              size="sm" 
              radius="xl"
              color="blue"
            >
              {`${ticket.tenantInfo.firstName[0]}${ticket.tenantInfo.lastName[0]}`}
            </Avatar>
            <Text size="sm">
              {ticket.tenantInfo.firstName} {ticket.tenantInfo.lastName}
            </Text>
          </Group>
        )}

        {ticket.assignedContractor && (
          <Group spacing="xs" mt="md">
            <IconUser size={16} />
            <Text size="sm">
              Réparateur assigné: {ticket.assignedContractor.name} 
              ({ticket.assignedContractor.specialty})
            </Text>
          </Group>
        )}

        <Divider />

        <Group position="apart">
          <Text size="xs" color="dimmed">
            Créé le {format(new Date(ticket.createdAt), 'dd MMMM yyyy', { locale: fr })}
          </Text>
          <Select
            size="xs"
            value={ticket.status}
            onChange={(value) => onStatusChange(ticket._id, value as string)}
            data={[
              { value: 'open', label: 'Ouvert' },
              { value: 'in_progress', label: 'En cours' },
              { value: 'resolved', label: 'Résolu' },
            ]}
          />
        </Group>
      </Stack>
    </Card>
  );
}

export function Tickets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [filterProperty, setFilterProperty] = useState<string | null>(null);
  const { tickets, isLoading, addTicket, updateTicket, deleteTicket } = useTickets();
  const navigate = useNavigate();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      propertyId: '',
      title: '',
      description: '',
      priority: 'medium' as const,
      ticketType: 'general' as const,
      tenantId: ''
    }
  });

  const { data: properties = [] } = useQuery('properties', getProperties);
  const { data: tenants = [] } = useQuery(
    ['tenants', form.values.propertyId],
    () => getTenants(form.values.propertyId),
    { enabled: !!form.values.propertyId }
  );

  const selectedProperty = properties.find(p => p._id === form.values.propertyId);

  // Transformer les tenants pour utiliser leur userId au lieu de leur _id
  const tenantOptions = tenants.map(tenant => ({
    value: tenant._id,
    label: `${tenant.firstName} ${tenant.lastName}`
  }));

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Si c'est un ticket spécifique à un tenant, trouver le tenant correspondant
      let tenantUserId = values.tenantId;
      if (values.ticketType === 'tenant_specific' && values.tenantId) {
        const tenant = tenants.find(t => t._id === values.tenantId);
        if (tenant) {
          tenantUserId = tenant._id;
        }
      }

      await addTicket({
        ...values,
        tenantId: tenantUserId
      });
      
      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('Form values:', form.values);
    if (form.values.propertyId) {
      const selectedProperty = properties.find(p => p._id === form.values.propertyId);
      console.log('Selected property:', selectedProperty);
      console.log('Tenants:', selectedProperty?.tenants);
    }
  }, [form.values, properties]);

  // Tri et filtrage des tickets
  const sortedAndFilteredTickets = useMemo(() => {
    let filteredTickets = tickets;
    
    // Filtrer par propriété si sélectionnée
    if (filterProperty) {
      filteredTickets = filteredTickets.filter(t => t.propertyId._id === filterProperty);
    }

    // Trier les tickets
    return [...filteredTickets].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });
  }, [tickets, sortBy, filterProperty]);

  const handleStatusChange = (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    updateTicket({ id: ticketId, status });
  };

  return (
    <Container size="xl">
      <Group position="apart" mb="xl">
        <Title>Tickets</Title>
        <Group>
          <Select
            placeholder="Sélectionner une propriété"
            data={properties.map(p => ({ value: p._id, label: p.name }))}
            value={selectedPropertyId}
            onChange={setSelectedPropertyId}
            style={{ width: 200 }}
            required
          />
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => {
              if (selectedPropertyId) {
                navigate(`/properties/${selectedPropertyId}/tickets/new`);
              } else {
                notifications.show({
                  title: 'Erreur',
                  message: 'Veuillez sélectionner une propriété',
                  color: 'red',
                });
              }
            }}
            disabled={!selectedPropertyId}
          >
            Nouveau ticket
          </Button>
        </Group>
      </Group>

      <Paper p="md" mb="md" withBorder>
        <Group>
          <Select
            placeholder="Filtrer par propriété"
            data={[
              { value: '', label: 'Toutes les propriétés' },
              ...properties.map(p => ({ value: p._id, label: p.name }))
            ]}
            value={filterProperty}
            onChange={setFilterProperty}
            clearable
            style={{ width: 200 }}
          />
          <Select
            placeholder="Trier par"
            data={[
              { value: 'date', label: 'Date', icon: IconSortDescending },
              { value: 'priority', label: 'Priorité', icon: IconAlertTriangle }
            ]}
            value={sortBy}
            onChange={(value: 'date' | 'priority') => setSortBy(value)}
            style={{ width: 150 }}
          />
        </Group>
      </Paper>

      <Grid>
        {sortedAndFilteredTickets.map((ticket) => (
          <Grid.Col key={ticket._id} span={{ base: 12, md: 6, lg: 4 }}>
            <TicketCard
              ticket={ticket}
              onStatusChange={handleStatusChange}
              onDelete={deleteTicket}
            />
          </Grid.Col>
        ))}
      </Grid>

      {sortedAndFilteredTickets.length === 0 && (
        <Paper p="xl" withBorder>
          <Stack align="center" spacing="md">
            <IconAlertTriangle size={48} color="gray" />
            <Text size="lg" weight={500}>Aucun ticket trouvé</Text>
            <Text color="dimmed" align="center">
              Il n'y a aucun ticket correspondant à vos critères de recherche.
            </Text>
          </Stack>
        </Paper>
      )}
    </Container>
  );
} 