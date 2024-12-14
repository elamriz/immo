import { Container, Title, Button, Group, Paper, Stack, Select } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import { useTenants } from '../hooks/useTenants';
import { usePayments } from '../hooks/usePayments';
import { PaymentList } from '../components/payment/PaymentList';
import { AddPaymentModal } from '../components/payment/AddPaymentModal';

export function Payments() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const { properties } = useProperties();
  const { tenants } = useTenants(selectedPropertyId);
  const { payments, isLoading, addPayment, deletePayment } = usePayments();

  const handleAddPayment = async (paymentData: any) => {
    try {
      await addPayment(paymentData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  if (isLoading) {
    return (
      <Container size="xl">
        <Title>Chargement...</Title>
      </Container>
    );
  }

  const filteredPayments = selectedPropertyId
    ? payments.filter(p => p.propertyId._id === selectedPropertyId)
    : payments;

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title>Paiements</Title>
        <Group>
          <Select
            placeholder="Sélectionner une propriété"
            data={properties.map(p => ({ value: p._id, label: p.name }))}
            value={selectedPropertyId}
            onChange={setSelectedPropertyId}
            clearable
          />
          <Select
            placeholder="Sélectionner un locataire"
            data={tenants.map(t => ({ 
              value: t._id, 
              label: `${t.firstName} ${t.lastName}` 
            }))}
            value={selectedTenantId}
            onChange={setSelectedTenantId}
            disabled={!selectedPropertyId}
            clearable
          />
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={!selectedPropertyId || !selectedTenantId}
          >
            Ajouter un paiement
          </Button>
        </Group>
      </Group>

      <PaymentList
        payments={filteredPayments}
        onView={() => {}}
        onEdit={() => {}}
        onDelete={deletePayment}
      />

      {selectedPropertyId && selectedTenantId && (
        <AddPaymentModal
          opened={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          propertyId={selectedPropertyId}
          tenantId={selectedTenantId}
          onAdd={handleAddPayment}
        />
      )}
    </Container>
  );
} 