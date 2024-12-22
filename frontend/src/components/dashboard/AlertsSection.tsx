import { Paper, Title, Stack, Group, Text, Progress, ThemeIcon, Box } from '@mantine/core';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';

interface AlertsSectionProps {
  alerts: {
    latePayments: number;
    urgentTickets: number;
    expiringLeases: number;
    availableProperties: number;
  };
  performance: {
    occupancyRate: number;
    ticketResolutionRate: number;
    paymentRate: number;
  };
}

export function AlertsSection({ alerts, performance }: AlertsSectionProps) {
  // Calcul de la performance globale (moyenne pondérée)
  const globalPerformance = Math.round(
    (performance.occupancyRate * 0.4) + // 40% importance
    (performance.ticketResolutionRate * 0.3) + // 30% importance
    (performance.paymentRate * 0.3) // 30% importance
  );

  const hasAlerts = alerts.latePayments > 0 || 
    alerts.urgentTickets > 0 || 
    alerts.expiringLeases > 0;

  return (
    <Paper withBorder p="md" radius="md">
      <Stack spacing="md">
        <Group position="apart" align="center">
          <Title order={3}>Alertes importantes</Title>
          <ThemeIcon 
            size="lg" 
            color={hasAlerts ? 'orange' : 'teal'} 
            variant="light"
          >
            {hasAlerts ? <IconAlertTriangle size={20} /> : <IconCheck size={20} />}
          </ThemeIcon>
        </Group>

        <Box>
          <Text size="sm" weight={500} mb={5}>Performance globale</Text>
          <Group spacing="xs" align="center">
            <Progress 
              value={globalPerformance} 
              size="xl" 
              radius="xl" 
              color={globalPerformance >= 75 ? 'teal' : globalPerformance >= 50 ? 'yellow' : 'red'}
              style={{ flex: 1 }}
            />
            <Text weight={700} size="sm">{globalPerformance}%</Text>
          </Group>
        </Box>

        {hasAlerts ? (
          <Stack spacing="xs">
            {alerts.latePayments > 0 && (
              <Group position="apart">
                <Text color="red" size="sm">Paiements en retard</Text>
                <Text weight={700} color="red">{alerts.latePayments}</Text>
              </Group>
            )}
            {alerts.urgentTickets > 0 && (
              <Group position="apart">
                <Text color="orange" size="sm">Tickets urgents</Text>
                <Text weight={700} color="orange">{alerts.urgentTickets}</Text>
              </Group>
            )}
            {alerts.expiringLeases > 0 && (
              <Group position="apart">
                <Text color="yellow" size="sm">Baux expirant bientôt</Text>
                <Text weight={700} color="yellow">{alerts.expiringLeases}</Text>
              </Group>
            )}
            {alerts.availableProperties > 0 && (
              <Group position="apart">
                <Text color="blue" size="sm">Propriétés disponibles</Text>
                <Text weight={700} color="blue">{alerts.availableProperties}</Text>
              </Group>
            )}
          </Stack>
        ) : (
          <Text color="dimmed" size="sm" align="center">
            Aucune alerte à signaler
          </Text>
        )}

        <Stack spacing={5}>
          <Text size="sm" weight={500}>Détails des performances</Text>
          <Group position="apart" spacing="xs">
            <Text size="xs" color="dimmed">Occupation</Text>
            <Text size="xs" weight={500}>{performance.occupancyRate}%</Text>
          </Group>
          <Group position="apart" spacing="xs">
            <Text size="xs" color="dimmed">Résolution tickets</Text>
            <Text size="xs" weight={500}>{performance.ticketResolutionRate}%</Text>
          </Group>
          <Group position="apart" spacing="xs">
            <Text size="xs" color="dimmed">Paiements à temps</Text>
            <Text size="xs" weight={500}>{performance.paymentRate}%</Text>
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
} 