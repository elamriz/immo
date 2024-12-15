import { 
  Container, Title, Button, Group, Paper, Stack, Select, 
  Text, Tabs, Badge, Loader 
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getProperties } from '../api/property';
import { PaymentList } from '../components/payment/PaymentList';
import { AddPaymentModal } from '../components/payment/AddPaymentModal';

export function Payments() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: properties = [], isLoading } = useQuery('properties', getProperties);
  const selectedProperty = properties.find(p => p._id === selectedPropertyId);

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
        <Title>Paiements</Title>
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
            Nouveau paiement
          </Button>
        </Group>
      </Group>

      {selectedProperty && (
        <Paper withBorder p="md" mb="xl">
          <Group position="apart">
            <Stack spacing={4}>
              <Text size="lg" weight={500}>{selectedProperty.name}</Text>
              <Text size="sm" color="dimmed">{selectedProperty.address}</Text>
            </Stack>
            {selectedProperty.isCoLiving && (
              <Badge color="blue" size="lg">Colocation</Badge>
            )}
          </Group>
        </Paper>
      )}

      <PaymentList propertyId={selectedPropertyId} />

      {selectedPropertyId && (
        <AddPaymentModal
          opened={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          propertyId={selectedPropertyId}
        />
      )}
    </Container>
  );
} 