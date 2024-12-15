import { Table, Badge, Group, Text, ActionIcon, Paper, Stack, SimpleGrid } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPropertyPayments } from '../../api/payment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PaymentDetailsModal } from './PaymentDetailsModal';
import { markPaymentAsPaid, sendPaymentReminder } from '../../api/payment';
import { notifications } from '@mantine/notifications';
import { useState, useMemo } from 'react';

interface PaymentListProps {
  propertyId: string | null;
  status?: string;
  month?: string;
}

export function PaymentList({ propertyId }: PaymentListProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const queryClient = useQueryClient();

  const markAsPaidMutation = useMutation(markPaymentAsPaid, {
    onSuccess: () => {
      queryClient.invalidateQueries(['payments', propertyId]);
      notifications.show({
        title: 'Succès',
        message: 'Paiement marqué comme payé',
        color: 'green'
      });
    }
  });

  const reminderMutation = useMutation(sendPaymentReminder, {
    onSuccess: () => {
      notifications.show({
        title: 'Succès',
        message: 'Rappel envoyé au locataire',
        color: 'blue'
      });
    }
  });

  const { data: payments = [], isLoading } = useQuery(
    ['payments', propertyId],
    () => getPropertyPayments(propertyId),
    { enabled: !!propertyId }
  );

  const groupedPayments = payments.reduce((acc, payment) => {
    const month = format(new Date(payment.dueDate), 'MMMM yyyy', { locale: fr });
    if (!acc[month]) acc[month] = [];
    acc[month].push(payment);
    return acc;
  }, {} as Record<string, any[]>);

  const stats = useMemo(() => {
    const total = payments.length;
    const paid = payments.filter(p => p.status === 'paid').length;
    const late = payments.filter(p => p.status === 'late').length;
    const pending = payments.filter(p => p.status === 'pending').length;

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      total,
      paid,
      late,
      pending,
      totalAmount,
      paidAmount,
      paymentRate: total ? (paid / total) * 100 : 0
    };
  }, [payments]);

  if (!propertyId) {
    return (
      <Paper p="xl" withBorder>
        <Stack align="center" spacing="md">
          <Text size="lg" weight={500}>Sélectionnez une propriété</Text>
          <Text color="dimmed">
            Veuillez sélectionner une propriété pour voir ses paiements
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack spacing="md">
      <SimpleGrid cols={4}>
        <Paper withBorder p="md">
          <Stack spacing={0}>
            <Text size="sm" c="dimmed">Total des paiements</Text>
            <Group position="apart" align="baseline">
              <Text fw={700} size="xl">{stats.totalAmount.toLocaleString('fr-FR')}€</Text>
              <Badge>{stats.total} paiements</Badge>
            </Group>
          </Stack>
        </Paper>

        <Paper withBorder p="md">
          <Stack spacing={0}>
            <Text size="sm" c="dimmed">Paiements reçus</Text>
            <Group position="apart" align="baseline">
              <Text fw={700} size="xl" c="green">
                {stats.paidAmount.toLocaleString('fr-FR')}€
              </Text>
              <Badge color="green">{stats.paid} payés</Badge>
            </Group>
          </Stack>
        </Paper>

        <Paper withBorder p="md">
          <Stack spacing={0}>
            <Text size="sm" c="dimmed">En attente</Text>
            <Group position="apart" align="baseline">
              <Text fw={700} size="xl" c="yellow">
                {((stats.totalAmount - stats.paidAmount)).toLocaleString('fr-FR')}€
              </Text>
              <Badge color="yellow">{stats.pending} en attente</Badge>
            </Group>
          </Stack>
        </Paper>

        <Paper withBorder p="md">
          <Stack spacing={0}>
            <Text size="sm" c="dimmed">En retard</Text>
            <Group position="apart" align="baseline">
              <Text fw={700} size="xl" c="red">
                {payments
                  .filter(p => p.status === 'late')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString('fr-FR')}€
              </Text>
              <Badge color="red">{stats.late} en retard</Badge>
            </Group>
          </Stack>
        </Paper>
      </SimpleGrid>

      {Object.entries(groupedPayments).map(([month, monthPayments]) => (
        <Paper key={month} withBorder p="md" mb="md">
          <Text size="lg" weight={500} mb="md">{month}</Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Locataire</Table.Th>
                <Table.Th>Montant</Table.Th>
                <Table.Th>Échéance</Table.Th>
                <Table.Th>Statut</Table.Th>
                <Table.Th>Méthode</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {monthPayments.map((payment) => (
                <Table.Tr key={payment._id}>
                  <Table.Td>
                    <Group spacing="sm">
                      {payment.tenantId.firstName} {payment.tenantId.lastName}
                      {payment.isCoLivingShare && (
                        <Badge size="sm">
                          {payment.shareDetails?.percentage}%
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack spacing={0}>
                      <Text>{payment.amount}€</Text>
                      {payment.isCoLivingShare && (
                        <Text size="xs" color="dimmed">
                          Loyer: {((payment.shareDetails?.totalRent || 0) * 
                            (payment.shareDetails?.percentage || 0) / 100).toFixed(2)}€
                          {Object.entries(payment.shareDetails?.commonCharges || {})
                            .filter(([_, amount]) => amount > 0)
                            .map(([type, amount]) => (
                              ` + ${type}: ${amount}€`
                            ))}
                        </Text>
                      )}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    {format(new Date(payment.dueDate), 'dd/MM/yyyy')}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        payment.status === 'paid' ? 'green' :
                        payment.status === 'late' ? 'red' : 'yellow'
                      }
                    >
                      {payment.status === 'paid' ? 'Payé' :
                       payment.status === 'late' ? 'En retard' : 'En attente'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {payment.paymentMethod === 'bank_transfer' ? 'Virement' :
                     payment.paymentMethod === 'cash' ? 'Espèces' : 'Chèque'}
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="blue">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red">
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
      
      <PaymentDetailsModal
        payment={selectedPayment}
        opened={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onMarkAsPaid={markAsPaidMutation.mutate}
        onSendReminder={reminderMutation.mutate}
      />
    </Stack>
  );
} 