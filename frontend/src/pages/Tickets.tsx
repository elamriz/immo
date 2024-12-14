import { Container, Title, Button, Group, Paper, Stack, Text, Select, Modal, TextInput, Textarea } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
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

export function Tickets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tickets, isLoading, addTicket, updateTicket, deleteTicket } = useTickets();
  const { properties } = useProperties();

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

  const selectedProperty = properties.find(p => p._id === form.values.propertyId);

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

      <Stack spacing="md">
        {tickets.map((ticket) => (
          <Paper key={ticket._id} p="md" withBorder>
            <Group position="apart">
              <div>
                <Text weight={500}>{ticket.title}</Text>
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
        onClose={() => setIsModalOpen(false)}
        title="Nouveau ticket"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Select
            label="Propriété"
            placeholder="Sélectionnez une propriété"
            data={properties.map((p) => ({ value: p._id, label: p.name }))}
            {...form.getInputProps('propertyId')}
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
            mb="md"
          />

          {form.values.ticketType === 'tenant_specific' && selectedProperty && (
            <Select
              label="Locataire"
              placeholder="Sélectionnez le locataire"
              data={selectedProperty.tenants?.map((t) => ({
                value: t.userId,
                label: `${t.firstName} ${t.lastName}`
              })) || []}
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
            <Button variant="subtle" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
} 