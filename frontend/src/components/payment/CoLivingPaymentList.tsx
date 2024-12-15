import { Table, Group, Text, Badge, ActionIcon, Paper, Title } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { Payment } from '../../types/payment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CoLivingPaymentListProps {
  payments: Payment[];
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
}

export function CoLivingPaymentList({ payments, onView, onEdit, onDelete }: CoLivingPaymentListProps) {
  const groupedPayments = payments.reduce((acc, payment) => {
    const key = format(new Date(payment.dueDate), 'MMMM yyyy', { locale: fr });
    if (!acc[key]) acc[key] = [];
    acc[key].push(payment);
    return acc;
  }, {} as Record<string, Payment[]>);

  return (
    <>
      {Object.entries(groupedPayments).map(([month, monthPayments]) => (
        <Paper key={month} withBorder p="md" mb="md">
          <Title order={3} mb="md">{month}</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Locataire</Table.Th>
                <Table.Th>Part</Table.Th>
                <Table.Th>Loyer</Table.Th>
                <Table.Th>Charges</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Statut</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {monthPayments.map((payment) => (
                <Table.Tr key={payment._id}>
                  <Table.Td>
                    {payment.tenantId.firstName} {payment.tenantId.lastName}
                  </Table.Td>
                  <Table.Td>
                    {payment.shareDetails?.percentage}%
                  </Table.Td>
                  <Table.Td>
                    {((payment.shareDetails?.totalRent || 0) * 
                      (payment.shareDetails?.percentage || 0) / 100).toFixed(2)}€
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {Object.entries(payment.shareDetails?.commonCharges || {})
                        .filter(([_, amount]) => amount > 0)
                        .map(([type, amount]) => (
                          `${type}: ${amount}€`
                        )).join(', ')}
                    </Text>
                  </Table.Td>
                  <Table.Td>{payment.amount}€</Table.Td>
                  <Table.Td>
                    <Badge
                      color={payment.status === 'paid' ? 'green' : 
                            payment.status === 'late' ? 'red' : 'yellow'}
                    >
                      {payment.status === 'paid' ? 'Payé' : 
                       payment.status === 'late' ? 'En retard' : 'En attente'}
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
        </Paper>
      ))}
    </>
  );
} 