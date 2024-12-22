import { Paper, Text, Group, RingProgress, Stack, Center } from '@mantine/core';

interface PropertyStatusChartProps {
  data: {
    occupied: number;
    available: number;
    maintenance: number;
  };
}

export function PropertyStatusChart({ data }: PropertyStatusChartProps) {
  const total = data.occupied + data.available + data.maintenance;
  
  const sections = [
    {
      value: (data.occupied / total) * 100,
      color: 'blue',
      tooltip: `${data.occupied} occupées`
    },
    {
      value: (data.available / total) * 100,
      color: 'green',
      tooltip: `${data.available} disponibles`
    },
    {
      value: (data.maintenance / total) * 100,
      color: 'orange',
      tooltip: `${data.maintenance} en maintenance`
    }
  ];

  return (
    <Paper withBorder p="md">
      <Group position="apart" mb="xs">
        <Text weight={500}>Statut des propriétés</Text>
      </Group>
      <Center>
        <RingProgress
          size={200}
          thickness={20}
          label={
            <Text size="xs" align="center">
              {total} propriétés
            </Text>
          }
          sections={sections}
        />
      </Center>
      <Stack spacing="xs" mt="md">
        <Group position="center" spacing="xl">
          <Group spacing="xs">
            <div style={{ width: 12, height: 12, backgroundColor: 'blue', borderRadius: '50%' }} />
            <Text size="sm">{data.occupied} occupées</Text>
          </Group>
          <Group spacing="xs">
            <div style={{ width: 12, height: 12, backgroundColor: 'green', borderRadius: '50%' }} />
            <Text size="sm">{data.available} disponibles</Text>
          </Group>
          <Group spacing="xs">
            <div style={{ width: 12, height: 12, backgroundColor: 'orange', borderRadius: '50%' }} />
            <Text size="sm">{data.maintenance} en maintenance</Text>
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
} 