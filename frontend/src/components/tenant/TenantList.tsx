import { Table, ActionIcon, Badge, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Tenant } from '../../types/tenant';
import { format } from 'date-fns';

interface TenantListProps {
  tenants: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
}

export function TenantList({ tenants, onEdit, onDelete }: TenantListProps) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Lease Period</Table.Th>
          <Table.Th>Monthly Rent</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {tenants.map((tenant) => (
          <Table.Tr key={tenant.id}>
            <Table.Td>
              <Text size="sm" fw={500}>
                {tenant.userId}
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
              <Text size="sm">
                {format(new Date(tenant.leaseStartDate), 'dd/MM/yyyy')} -{' '}
                {format(new Date(tenant.leaseEndDate), 'dd/MM/yyyy')}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">€{tenant.monthlyRent}</Text>
            </Table.Td>
            <Table.Td>
              <Group gap={4}>
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={() => onEdit(tenant)}
                >
                  <IconPencil size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onDelete(tenant.id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
} 