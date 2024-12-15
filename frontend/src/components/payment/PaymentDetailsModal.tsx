import { Modal, Group, Text, Stack, Badge, Button, Divider } from '@mantine/core';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Payment } from '../../types/payment';
import { IconReceipt, IconPrinter, IconMail } from '@tabler/icons-react';

interface PaymentDetailsModalProps {
  payment: Payment | null;
  opened: boolean;
  onClose: () => void;
  onMarkAsPaid: (id: string) => void;
  onSendReminder: (id: string) => void;
}

export function PaymentDetailsModal({
  payment,
  opened,
  onClose,
  onMarkAsPaid,
  onSendReminder
}: PaymentDetailsModalProps) {
  if (!payment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'late': return 'red';
      default: return 'yellow';
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Détails du paiement - ${format(new Date(payment.dueDate), 'MMMM yyyy', { locale: fr })}`}
      size="lg"
    >
      <Stack spacing="md">
        <Group position="apart">
          <Stack spacing={4}>
            <Text size="sm" color="dimmed">Montant</Text>
            <Text size="xl" weight={700}>{payment.amount.toLocaleString('fr-FR')}€</Text>
          </Stack>
          <Badge size="lg" color={getStatusColor(payment.status)}>
            {payment.status === 'paid' ? 'Payé' :
             payment.status === 'late' ? 'En retard' : 'En attente'}
          </Badge>
        </Group>

        <Divider />

        <Group position="apart">
          <Stack spacing={4}>
            <Text size="sm" color="dimmed">Propriété</Text>
            <Text>{payment.propertyId.name}</Text>
          </Stack>
          <Stack spacing={4} align="flex-end">
            <Text size="sm" color="dimmed">Locataire</Text>
            <Text>
              {payment.tenantId.firstName} {payment.tenantId.lastName}
            </Text>
          </Stack>
        </Group>

        {payment.isCoLivingShare && (
          <>
            <Divider />
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Détails de la colocation</Text>
              <Text size="sm">
                Part: {payment.shareDetails?.percentage}% 
                ({((payment.shareDetails?.totalRent || 0) * 
                  (payment.shareDetails?.percentage || 0) / 100).toFixed(2)}€)
              </Text>
              <Text size="sm">Charges communes:</Text>
              {Object.entries(payment.shareDetails?.commonCharges || {})
                .filter(([_, amount]) => amount > 0)
                .map(([type, amount]) => (
                  <Text key={type} size="sm" ml="md">
                    • {type}: {amount}€
                  </Text>
                ))}
            </Stack>
          </>
        )}

        <Divider />

        <Stack spacing="xs">
          <Text size="sm" weight={500}>Dates</Text>
          <Group>
            <Text size="sm" color="dimmed">Échéance:</Text>
            <Text size="sm">
              {format(new Date(payment.dueDate), 'dd MMMM yyyy', { locale: fr })}
            </Text>
          </Group>
          {payment.paidDate && (
            <Group>
              <Text size="sm" color="dimmed">Date de paiement:</Text>
              <Text size="sm">
                {format(new Date(payment.paidDate), 'dd MMMM yyyy', { locale: fr })}
              </Text>
            </Group>
          )}
        </Stack>

        {payment.paymentMethod && (
          <>
            <Divider />
            <Group>
              <Text size="sm" color="dimmed">Méthode de paiement:</Text>
              <Text size="sm">
                {payment.paymentMethod === 'bank_transfer' ? 'Virement bancaire' :
                 payment.paymentMethod === 'cash' ? 'Espèces' : 'Chèque'}
              </Text>
            </Group>
          </>
        )}

        <Divider />

        <Group position="apart">
          <Group>
            <Button
              variant="light"
              leftIcon={<IconPrinter size={16} />}
              onClick={() => window.print()}
            >
              Imprimer
            </Button>
            <Button
              variant="light"
              leftIcon={<IconReceipt size={16} />}
              onClick={() => {/* TODO: Générer une quittance */}}
            >
              Quittance
            </Button>
          </Group>
          
          {payment.status !== 'paid' && (
            <Group>
              <Button
                variant="light"
                color="blue"
                leftIcon={<IconMail size={16} />}
                onClick={() => onSendReminder(payment._id)}
              >
                Relancer
              </Button>
              <Button
                color="green"
                onClick={() => onMarkAsPaid(payment._id)}
              >
                Marquer comme payé
              </Button>
            </Group>
          )}
        </Group>
      </Stack>
    </Modal>
  );
} 