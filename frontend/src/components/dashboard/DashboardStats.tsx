import { Grid, Card, Text, Group, Stack } from '@mantine/core';
import { IconHome, IconUsers, IconReceipt, IconTicket } from '@tabler/icons-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card withBorder p="md">
      <Group justify="space-between" align="flex-start">
        {icon}
        <Stack align="flex-end" gap={0}>
          <Text size="xl" fw={700}>
            {value}
          </Text>
          <Text size="sm" c="dimmed">
            {title}
          </Text>
          {description && (
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          )}
        </Stack>
      </Group>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatsCard
          title="Propriétés"
          value={12}
          icon={<IconHome size={24} />}
          description="2 disponibles"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatsCard
          title="Locataires"
          value={28}
          icon={<IconUsers size={24} />}
          description="3 nouveaux ce mois"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatsCard
          title="Revenus mensuels"
          value="24 500 €"
          icon={<IconReceipt size={24} />}
          description="+8% vs mois dernier"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatsCard
          title="Tickets ouverts"
          value={5}
          icon={<IconTicket size={24} />}
          description="2 urgents"
        />
      </Grid.Col>
    </Grid>
  );
} 