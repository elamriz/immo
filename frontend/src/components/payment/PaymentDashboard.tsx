import { Paper, Group, Text, SimpleGrid, RingProgress, Stack, Center } from '@mantine/core';
import { IconCash, IconAlertCircle, IconCheck } from '@tabler/icons-react';

interface PaymentStats {
  totalDue: number;
  totalPaid: number;
  totalLate: number;
  paymentRate: number;
}

interface PaymentDashboardProps {
  stats: PaymentStats;
}

export function PaymentDashboard({ stats }: PaymentDashboardProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
      <Paper withBorder p="md">
        <Group justify="space-between">
          <Stack spacing={0}>
            <Text size="xs" c="dimmed">
              Total des paiements
            </Text>
            <Text fw={700} size="xl">
              {stats.totalDue.toLocaleString('fr-FR')}€
            </Text>
            <Text size="xs" c="dimmed">
              dont {stats.totalPaid.toLocaleString('fr-FR')}€ payés
            </Text>
          </Stack>
          <IconCash size={32} color="gray" />
        </Group>
      </Paper>

      <Paper withBorder p="md">
        <Group justify="space-between">
          <Stack spacing={0}>
            <Text size="xs" c="dimmed">
              Paiements en retard
            </Text>
            <Text fw={700} size="xl" c="red">
              {stats.totalLate.toLocaleString('fr-FR')}€
            </Text>
            <Text size="xs" c="dimmed">
              sur {stats.totalDue.toLocaleString('fr-FR')}€
            </Text>
          </Stack>
          <IconAlertCircle size={32} color="red" />
        </Group>
      </Paper>

      <Paper withBorder p="md">
        <Group justify="space-between">
          <Stack spacing={0}>
            <Text size="xs" c="dimmed">
              Taux de paiement
            </Text>
            <Text fw={700} size="xl">
              {stats.paymentRate}%
            </Text>
          </Stack>
          <RingProgress
            size={64}
            thickness={4}
            sections={[{ value: stats.paymentRate, color: 'blue' }]}
            label={
              <Center>
                <IconCheck size={22} color={stats.paymentRate >= 90 ? 'teal' : 'gray'} />
              </Center>
            }
          />
        </Group>
      </Paper>
    </SimpleGrid>
  );
} 