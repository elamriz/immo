import { Alert, Stack } from '@mantine/core';
import { 
  IconAlertCircle, 
  IconCalendarTime, 
  IconCash,
  IconHome 
} from '@tabler/icons-react';

interface DashboardAlertsProps {
  latePayments: number;
  urgentTickets: number;
  expiringLeases: number;
  availableProperties: number;
}

export function DashboardAlerts({ 
  latePayments, 
  urgentTickets, 
  expiringLeases,
  availableProperties 
}: DashboardAlertsProps) {
  return (
    <Stack spacing="xs" mb="xl">
      {latePayments > 0 && (
        <Alert icon={<IconCash size={16} />} color="red" variant="light">
          {latePayments} paiement{latePayments > 1 ? 's' : ''} en retard
        </Alert>
      )}
      
      {urgentTickets > 0 && (
        <Alert icon={<IconAlertCircle size={16} />} color="orange" variant="light">
          {urgentTickets} ticket{urgentTickets > 1 ? 's' : ''} urgent{urgentTickets > 1 ? 's' : ''} non résolu{urgentTickets > 1 ? 's' : ''}
        </Alert>
      )}

      {expiringLeases > 0 && (
        <Alert icon={<IconCalendarTime size={16} />} color="yellow" variant="light">
          {expiringLeases} bail{expiringLeases > 1 ? 'x' : ''} expire{expiringLeases > 1 ? 'nt' : ''} dans les 30 jours
        </Alert>
      )}

      {availableProperties > 0 && (
        <Alert icon={<IconHome size={16} />} color="blue" variant="light">
          {availableProperties} propriété{availableProperties > 1 ? 's' : ''} disponible{availableProperties > 1 ? 's' : ''}
        </Alert>
      )}
    </Stack>
  );
} 