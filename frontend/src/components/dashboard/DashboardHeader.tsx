import { Title, Group, Button, Text, Stack } from '@mantine/core';
import { IconChartBar, IconDownload } from '@tabler/icons-react';

interface DashboardHeaderProps {
  onExportData?: () => void;
}

export function DashboardHeader({ onExportData }: DashboardHeaderProps) {
  return (
    <Stack spacing="xs" mb="xl">
      <Group position="apart">
        <Group spacing="xs">
          <IconChartBar size={32} />
          <Title order={2}>Tableau de bord</Title>
        </Group>
        <Button
          variant="light"
          leftIcon={<IconDownload size={16} />}
          onClick={onExportData}
        >
          Exporter les données
        </Button>
      </Group>
      <Text color="dimmed" size="sm">
        Vue d'ensemble de vos propriétés, paiements et locataires
      </Text>
    </Stack>
  );
} 