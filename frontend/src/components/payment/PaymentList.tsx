import { Table, Badge, ActionIcon, Group, Text, Stack } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { Payment } from '../../types/payment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaymentListProps {
  payments: Payment[];
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
}

export function PaymentList({ payments, onView, onEdit, onDelete }: PaymentListProps) {
  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'late':
        return 'En retard';
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Locataire</Table.Th>
          <Table.Th>Montant</Table.Th>
          <Table.Th>Date d'échéance</Table.Th>
          <Table.Th>Date de paiement</Table.Th>
          <Table.Th>Statut</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {payments.map((payment) => (
          <Table.Tr key={payment._id}>
            <Table.Td>
              <Stack spacing={4}>
                <Text size="sm" fw={500}>
                  {payment.tenantId.firstName} {payment.tenantId.lastName}
                </Text>
                <Text size="xs" c="dimmed">
                  {payment.propertyId.name}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <Text fw={500}>{payment.amount} €</Text>
            </Table.Td>
            <Table.Td>{formatDate(payment.dueDate)}</Table.Td>
            <Table.Td>
              {payment.paidDate ? formatDate(payment.paidDate) : '-'}
            </Table.Td>
            <Table.Td>
              <Badge color={getStatusColor(payment.status)}>
                {getStatusLabel(payment.status)}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Group gap={4}>
                <ActionIcon 
                  variant="subtle" 
                  color="blue"
                  onClick={() => onView(payment)}
                >
                  <IconEye size={16} />
                </ActionIcon>
                <ActionIcon 
                  variant="subtle" 
                  color="blue"
                  onClick={() => onEdit(payment)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon 
                  variant="subtle" 
                  color="red"
                  onClick={() => onDelete(payment._id)}
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