import { Paper, Text, Group, Stack, Badge } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  stats: {
    label: string;
    value: number;
    color?: string;
    link?: string;
  }[];
}

export function StatCard({ title, icon, stats }: StatCardProps) {
  const navigate = useNavigate();

  return (
    <Paper withBorder p="md">
      <Group position="apart" mb="xs">
        <Text weight={500}>{title}</Text>
        {icon}
      </Group>
      <Stack spacing={4}>
        {stats.map((stat, index) => (
          <Badge
            key={index}
            color={stat.color || 'blue'}
            variant="light"
            style={{ cursor: stat.link ? 'pointer' : 'default' }}
            onClick={() => stat.link && navigate(stat.link)}
          >
            {stat.value} {stat.label}
          </Badge>
        ))}
      </Stack>
    </Paper>
  );
} 