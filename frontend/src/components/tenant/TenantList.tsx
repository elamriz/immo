import { Table, ActionIcon, Group, Badge } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Tenant } from '../../types/tenant';

interface TenantListProps {
  tenants: Tenant[];
  onUpdate: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
}

export function TenantList({ tenants, onUpdate, onDelete }: TenantListProps) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Nom</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Téléphone</Table.Th>
          <Table.Th>Statut</Table.Th>
          <Table.Th>Loyer</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {tenants.map((tenant) => (
          <Table.Tr key={tenant._id}>
            <Table.Td>{tenant.firstName} {tenant.lastName}</Table.Td>
            <Table.Td>{tenant.email}</Table.Td>
            <Table.Td>{tenant.phone}</Table.Td>
            <Table.Td>
              <Badge
                color={
                  tenant.status === 'active' ? 'green' :
                  tenant.status === 'pending' ? 'yellow' : 'red'
                }
              >
                {tenant.status}
              </Badge>
            </Table.Td>
            <Table.Td>{tenant.rentAmount}€</Table.Td>
            <Table.Td>
              <Group gap="xs">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => onUpdate(tenant)}
                >
                  <IconEdit size={20} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => onDelete(tenant._id)}
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
} 