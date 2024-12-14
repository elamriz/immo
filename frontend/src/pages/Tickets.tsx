import { Container, Title, Button, Group, Paper, Stack, Text, Select, Modal, TextInput, Textarea, Tabs } from '@mantine/core';
import { IconPlus, IconSortDescending, IconHome, IconAlertTriangle } from '@tabler/icons-react';
import { useState, useEffect, useMemo } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useProperties } from '../hooks/useProperties';
import { useForm } from '@mantine/form';

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
}

interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'pending' | 'active' | 'ended';
  rentStatus: 'paid' | 'pending' | 'late';
}

interface Property {
  _id: string;
  name: string;
  address: string;
  type: 'house' | 'apartment' | 'commercial';
  size: number;
  numberOfRooms: number;
  maxTenants: number;
  rentAmount: number;
  description?: string;
  status: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
  images?: string[];
  owner: string;
  tenants: {
    userId: string;
    firstName: string;
    lastName: string;
    leaseStartDate: string;
    leaseEndDate: string;
    rentAmount: number;
    depositAmount: number;
    status: 'active' | 'inactive';
    rentStatus: 'pending' | 'paid';
    _id: string;
  }[];
}

export function Tickets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [filterProperty, setFilterProperty] = useState<string | null>(null);
  const { tickets, isLoading, addTicket, updateTicket, deleteTicket } = useTickets();
  const { properties } = useProperties();

  useEffect(() => {
    console.log('Properties:', properties);
  }, [properties]);

  const form = useForm({
    initialValues: {
      propertyId: '',
      title: '',
      description: '',
      priority: 'medium' as 'low' | 'medium' | 'high',
      ticketType: 'general' as 'general' | 'tenant_specific',
      tenantId: ''
    },
    validate: {
      propertyId: (value) => (!value ? 'Sélectionnez une propriété' : null),
      title: (value) => (!value ? 'Le titre est requis' : null),
      description: (value) => (!value ? 'La description est requise' : null),
      tenantId: (value, values) => (
        values.ticketType === 'tenant_specific' && !value 
          ? 'Le locataire est requis pour un ticket spécifique' 
          : null
      ),
    },
  });

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

  const handleSubmit = (values: typeof form.values) => {
    addTicket(values);
    setIsModalOpen(false);
    form.reset();
  };

  const handleStatusChange = (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    updateTicket({ id: ticketId, status });
  };

  return (
    <Container size="lg">
      <Group position="apart" mb="xl">
        <Title>Tickets</Title>
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Nouveau ticket
        </Button>
      </Group>

      <Group mb="md">
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

      <Stack spacing="md">
        {sortedAndFilteredTickets.map((ticket) => (
          <Paper key={ticket._id} p="md" withBorder>
            <Group position="apart">
              <div>
                <Group spacing="xs">
                  <Text weight={500}>{ticket.title}</Text>
                  {ticket.priority === 'high' && (
                    <IconAlertTriangle size={16} color="red" />
                  )}
                </Group>
                <Text size="sm" color="dimmed">
                  {ticket.description}
                </Text>
                <Text size="xs" color="dimmed">
                  {ticket.propertyId.name}
                  {ticket.tenantId && ` - ${ticket.tenantId.firstName} ${ticket.tenantId.lastName}`}
                </Text>
              </div>
              <Group>
                <Select
                  value={ticket.status}
                  onChange={(value) => handleStatusChange(ticket._id, value as any)}
                  data={[
                    { value: 'open', label: 'Ouvert' },
                    { value: 'in_progress', label: 'En cours' },
                    { value: 'resolved', label: 'Résolu' },
                  ]}
                />
                <Button
                  color="red"
                  variant="subtle"
                  onClick={() => deleteTicket(ticket._id)}
                >
                  Supprimer
                </Button>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          form.reset();
        }}
        title="Nouveau ticket"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Select
            label="Propriété"
            placeholder="Sélectionnez une propriété"
            data={properties.map(p => ({ value: p._id, label: p.name }))}
            {...form.getInputProps('propertyId')}
            onChange={(value) => {
              form.setFieldValue('propertyId', value);
              form.setFieldValue('tenantId', '');
              console.log('Property changed to:', value);
            }}
            mb="md"
          />

          <Select
            label="Type de ticket"
            placeholder="Sélectionnez le type de ticket"
            data={[
              { value: 'general', label: 'Général (tout l\'immeuble)' },
              { value: 'tenant_specific', label: 'Spécifique à un locataire' }
            ]}
            {...form.getInputProps('ticketType')}
            onChange={(value) => {
              form.setFieldValue('ticketType', value);
              form.setFieldValue('tenantId', '');
              console.log('Ticket type changed to:', value);
            }}
            mb="md"
          />

          {form.values.ticketType === 'tenant_specific' && form.values.propertyId && (
            <Select
              label="Locataire"
              placeholder="Sélectionnez le locataire"
              data={(() => {
                const selectedProperty = properties.find(p => p._id === form.values.propertyId);
                console.log('Selected property:', selectedProperty);
                console.log('Tenants:', selectedProperty?.tenants);
                const tenantOptions = selectedProperty?.tenants
                  ?.filter(t => t.status === 'active' && t._id && t.firstName && t.lastName)
                  ?.map((t) => ({
                    value: t._id,
                    label: `${t.firstName} ${t.lastName}`.trim()
                  })) || [];
                console.log('Tenant options:', tenantOptions);
                return tenantOptions;
              })()}
              {...form.getInputProps('tenantId')}
              mb="md"
            />
          )}

          <TextInput
            label="Titre"
            placeholder="Titre du ticket"
            {...form.getInputProps('title')}
            mb="md"
          />

          <Textarea
            label="Description"
            placeholder="Description du problème"
            {...form.getInputProps('description')}
            mb="md"
          />

          <Select
            label="Priorité"
            data={[
              { value: 'low', label: 'Basse' },
              { value: 'medium', label: 'Moyenne' },
              { value: 'high', label: 'Haute' },
            ]}
            {...form.getInputProps('priority')}
            mb="xl"
          />

          <Group position="right">
            <Button variant="subtle" onClick={() => {
              setIsModalOpen(false);
              form.reset();
            }}>
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
} 