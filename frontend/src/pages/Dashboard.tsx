import { Container, Grid } from '@mantine/core';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentAlerts } from '../components/dashboard/RecentAlerts';

export function Dashboard() {
  return (
    <Container size="xl">
      <DashboardStats />
      <Grid mt="md">
        <Grid.Col span={12}>
          <RecentAlerts />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 