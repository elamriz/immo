import { Card, Text, Stack, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface AlertItem {
  id: string;
  type: 'payment' | 'ticket' | 'lease';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

const alerts: AlertItem[] = [
  {
    id: '1',
    type: 'payment',
    message: 'Paiement en retard - Appartement 12B',
    severity: 'high',
  },
  {
    id: '2',
    type: 'ticket',
    message: 'Nouveau ticket urgent - Fuite d\'eau',
    severity: 'high',
  },
  {
    id: '3',
    type: 'lease',
    message: 'Bail expirant dans 30 jours - Studio 5',
    severity: 'medium',
  },
];

export function RecentAlerts() {
  return (
    <Card withBorder>
      <Text size="lg" fw={500} mb="md">
        Alertes récentes
      </Text>
      <Stack>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            icon={<IconAlertCircle size={16} />}
            title={alert.type === 'payment' ? 'Paiement' : alert.type === 'ticket' ? 'Ticket' : 'Bail'}
            color={alert.severity === 'high' ? 'red' : alert.severity === 'medium' ? 'yellow' : 'blue'}
          >
            {alert.message}
          </Alert>
        ))}
      </Stack>
    </Card>
  );
} 