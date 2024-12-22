import { Paper, Text, SimpleGrid, Group, RingProgress, Stack, Badge, Tooltip } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconInfoCircle } from '@tabler/icons-react';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DetailedStatsProps {
  stats: {
    occupation: {
      rate: number;
      total: number;
      occupied: number;
      trend: number;
    };
    tickets: {
      resolutionRate: number;
      total: number;
      resolved: number;
      trend: number;
    };
    payments: {
      onTimeRate: number;
      total: number;
      onTime: number;
      trend: number;
    };
  };
}

export function DetailedStats({ stats }: DetailedStatsProps) {
  const currentMonth = format(new Date(), 'MMMM yyyy', { locale: fr });
  const lastMonth = format(subMonths(new Date(), 1), 'MMMM yyyy', { locale: fr });

  const getStatColor = (value: number) => {
    if (value >= 90) return 'teal';
    if (value >= 75) return 'blue';
    if (value >= 50) return 'yellow';
    return 'red';
  };

  const getTrendBadge = (trend: number = 0) => (
    <Badge
      variant="light"
      color={trend >= 0 ? 'teal' : 'red'}
      leftSection={trend >= 0 ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
    >
      {trend > 0 ? '+' : ''}{trend}% vs {lastMonth}
    </Badge>
  );

  return (
    <Paper withBorder p="xl" radius="md">
      <Group position="apart" mb="xl">
        <Text size="xl" weight={700}>Statistiques détaillées</Text>
        <Text color="dimmed" size="sm">Période : {currentMonth}</Text>
      </Group>

      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} spacing="xl">
        {/* Taux d'occupation */}
        <Stack spacing="md">
          <Group position="apart">
            <Group spacing="xs">
              <Text size="lg" weight={500}>Taux d'occupation</Text>
              <Tooltip label="Pourcentage de propriétés actuellement occupées">
                <IconInfoCircle size={16} style={{ cursor: 'help' }} />
              </Tooltip>
            </Group>
            {getTrendBadge(stats.occupation.trend)}
          </Group>
          <Group position="center">
            <RingProgress
              size={120}
              thickness={12}
              sections={[
                { value: stats.occupation.rate, color: getStatColor(stats.occupation.rate) },
              ]}
              label={
                <Text size="lg" align="center" weight={700}>
                  {stats.occupation.rate}%
                </Text>
              }
            />
          </Group>
          <Stack spacing={0}>
            <Group position="apart">
              <Text size="sm" color="dimmed">Propriétés occupées</Text>
              <Text weight={500}>{stats.occupation.occupied}</Text>
            </Group>
            <Group position="apart">
              <Text size="sm" color="dimmed">Total des propriétés</Text>
              <Text weight={500}>{stats.occupation.total}</Text>
            </Group>
          </Stack>
        </Stack>

        {/* Résolution des tickets */}
        <Stack spacing="md">
          <Group position="apart">
            <Group spacing="xs">
              <Text size="lg" weight={500}>Résolution des tickets</Text>
              <Tooltip label="Pourcentage de tickets résolus ce mois-ci">
                <IconInfoCircle size={16} style={{ cursor: 'help' }} />
              </Tooltip>
            </Group>
            {getTrendBadge(stats.tickets.trend)}
          </Group>
          <Group position="center">
            <RingProgress
              size={120}
              thickness={12}
              sections={[
                { value: stats.tickets.resolutionRate, color: getStatColor(stats.tickets.resolutionRate) },
              ]}
              label={
                <Text size="lg" align="center" weight={700}>
                  {stats.tickets.resolutionRate}%
                </Text>
              }
            />
          </Group>
          <Stack spacing={0}>
            <Group position="apart">
              <Text size="sm" color="dimmed">Tickets résolus</Text>
              <Text weight={500}>{stats.tickets.resolved}</Text>
            </Group>
            <Group position="apart">
              <Text size="sm" color="dimmed">Total des tickets</Text>
              <Text weight={500}>{stats.tickets.total}</Text>
            </Group>
          </Stack>
        </Stack>

        {/* Paiements à temps */}
        <Stack spacing="md">
          <Group position="apart">
            <Group spacing="xs">
              <Text size="lg" weight={500}>Paiements à temps</Text>
              <Tooltip label="Pourcentage de paiements reçus avant la date d'échéance ce mois-ci">
                <IconInfoCircle size={16} style={{ cursor: 'help' }} />
              </Tooltip>
            </Group>
            {getTrendBadge(stats.payments.trend)}
          </Group>
          <Group position="center">
            <RingProgress
              size={120}
              thickness={12}
              sections={[
                { value: stats.payments.onTimeRate, color: getStatColor(stats.payments.onTimeRate) },
              ]}
              label={
                <Text size="lg" align="center" weight={700}>
                  {stats.payments.onTimeRate}%
                </Text>
              }
            />
          </Group>
          <Stack spacing={0}>
            <Group position="apart">
              <Text size="sm" color="dimmed">Paiements à temps</Text>
              <Text weight={500}>{stats.payments.onTime}</Text>
            </Group>
            <Group position="apart">
              <Text size="sm" color="dimmed">Total des paiements</Text>
              <Text weight={500}>{stats.payments.total}</Text>
            </Group>
          </Stack>
        </Stack>
      </SimpleGrid>

      <Text size="xs" color="dimmed" mt="xl" align="center">
        Les tendances sont calculées par rapport au mois précédent ({lastMonth})
      </Text>
    </Paper>
  );
} 