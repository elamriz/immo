import { Paper, Text, Group, SimpleGrid, Stack, useMantineTheme } from '@mantine/core';
import { TrendChart } from './TrendChart';
import { useMediaQuery } from '@mantine/hooks';

interface ResponsiveChartsProps {
  data: {
    payments: Array<{ month: string; value: number }>;
    tickets: Array<{ month: string; value: number }>;
    occupancy: Array<{ month: string; value: number }>;
  };
}

export function ResponsiveCharts({ data }: ResponsiveChartsProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Stack spacing="lg">
      {isMobile ? (
        // Vue mobile : graphiques empilés verticalement
        <>
          <Paper withBorder p="md" radius="md">
            <TrendChart 
              data={data.payments}
              title="Évolution des paiements"
              color="#228be6"
              valueLabel="€"
              height={200}
            />
          </Paper>
          <Paper withBorder p="md" radius="md">
            <TrendChart 
              data={data.tickets}
              title="Évolution des tickets"
              color="#40c057"
              valueLabel="tickets"
              height={200}
            />
          </Paper>
          <Paper withBorder p="md" radius="md">
            <TrendChart 
              data={data.occupancy}
              title="Taux d'occupation"
              color="#fd7e14"
              valueLabel="%"
              height={200}
            />
          </Paper>
        </>
      ) : (
        // Vue desktop : graphiques côte à côte
        <>
          <Paper withBorder p="md" radius="md">
            <SimpleGrid cols={2} spacing="lg">
              <TrendChart 
                data={data.payments}
                title="Évolution des paiements"
                color="#228be6"
                valueLabel="€"
              />
              <TrendChart 
                data={data.tickets}
                title="Évolution des tickets"
                color="#40c057"
                valueLabel="tickets"
              />
            </SimpleGrid>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <TrendChart 
              data={data.occupancy}
              title="Taux d'occupation"
              color="#fd7e14"
              valueLabel="%"
            />
          </Paper>
        </>
      )}
    </Stack>
  );
} 