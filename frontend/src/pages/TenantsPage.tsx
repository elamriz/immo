import { Container, Title, Group, Button, Select, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { TenantList } from '../components/tenant/TenantList';
import { AddTenantModal } from '../components/tenant/AddTenantModal';
import { useProperties } from '../hooks/useProperties';
import { useTenants } from '../hooks/useTenants';

export function TenantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  
  const { properties, isLoading: propertiesLoading } = useProperties();
  const { 
    tenants, 
    isLoading: tenantsLoading,
    addTenant,
    updateTenant,
    deleteTenant 
  } = useTenants(selectedPropertyId);

  const propertyOptions = properties.map((property) => ({
    value: property._id,
    label: property.name,
  }));

  if (propertiesLoading || tenantsLoading) {
    return <Container><Text>Loading...</Text></Container>;
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title>Tenants Management</Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedPropertyId}
        >
          Add Tenant
        </Button>
      </Group>

      <Select
        label="Select Property"
        placeholder="Choose a property to view its tenants"
        data={propertyOptions}
        value={selectedPropertyId}
        onChange={setSelectedPropertyId}
        mb="xl"
      />

      {selectedPropertyId ? (
        <TenantList
          tenants={tenants}
          onUpdate={updateTenant}
          onDelete={deleteTenant}
        />
      ) : (
        <Text c="dimmed" ta="center">
          Please select a property to view its tenants
        </Text>
      )}

      <AddTenantModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTenant}
        propertyId={selectedPropertyId!}
      />
    </Container>
  );
} 