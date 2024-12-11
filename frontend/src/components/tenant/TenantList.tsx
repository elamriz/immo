import { Table, ActionIcon, Badge, Group, Text, Card, Stack } from '@mantine/core';
import { IconPencil, IconTrash, IconEye } from '@tabler/icons-react';
import { useState } from 'react';
import { Tenant } from '../../types/tenant';
import { EditTenantModal } from './EditTenantModal';
import { TenantDetailsModal } from './TenantDetailsModal';
import { format } from 'date-fns';

interface TenantListProps {
  tenants: Tenant[];
  onUpdate: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
}

export function TenantList({ tenants, onUpdate, onDelete }: TenantListProps) {
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);

  const getRentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'late':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Contact</Table.Th>
            <Table.Th>Lease Period</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Rent Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tenants.map((tenant) => (
            <Table.Tr key={tenant._id}>
              <Table.Td>
                <Text fw={500}>
                  {tenant.firstName} {tenant.lastName}
                </Text>
              </Table.Td>
              <Table.Td>
                <Stack spacing={4}>
                  <Text size="sm">{tenant.email}</Text>
                  <Text size="sm" c="dimmed">
                    {tenant.phone}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {format(new Date(tenant.leaseStartDate), 'dd/MM/yyyy')} -{' '}
                  {format(new Date(tenant.leaseEndDate), 'dd/MM/yyyy')}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge
                  color={
                    tenant.status === 'active'
                      ? 'green'
                      : tenant.status === 'pending'
                      ? 'yellow'
                      : 'red'
                  }
                >
                  {tenant.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge color={getRentStatusColor(tenant.rentStatus)}>
                  {tenant.rentStatus}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => setViewingTenant(tenant)}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => setEditingTenant(tenant)}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => onDelete(tenant._id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {editingTenant && (
        <EditTenantModal
          tenant={editingTenant}
          opened={!!editingTenant}
          onClose={() => setEditingTenant(null)}
          onUpdate={onUpdate}
        />
      )}

      {viewingTenant && (
        <TenantDetailsModal
          tenant={viewingTenant}
          opened={!!viewingTenant}
          onClose={() => setViewingTenant(null)}
        />
      )}
    </>
  );
} 