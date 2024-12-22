import {
  Container, Grid, Paper, Text, Group, RingProgress,
  Stack, Badge, Loader, SimpleGrid, MediaQuery, Burger, Box
} from '@mantine/core';
import {
  IconHome, IconUsers, IconTicket, IconCash,
  IconAlertCircle, IconCheck, IconArrowUpRight, IconPlus
} from '@tabler/icons-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { DashboardAlerts } from '../components/dashboard/DashboardAlerts';
import { PropertyStatusChart } from '../components/dashboard/PropertyStatusChart';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { useNavigate } from 'react-router-dom';
import { TrendChart } from '../components/dashboard/TrendChart';
import { useDashboardStyles } from '../styles/dashboard';
import { AlertsSection } from '../components/dashboard/AlertsSection';
import { DetailedStats } from '../components/dashboard/DetailedStats';
import { DashboardStats } from '../types/dashboard';
import { ResponsiveCharts } from '../components/dashboard/ResponsiveCharts';

export function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();
  const navigate = useNavigate();
  const { classes, cx } = useDashboardStyles();

  const isDataReady = stats && 
    stats.chartData && 
    stats.trends && 
    stats.properties && 
    stats.tickets && 
    stats.payments;

  if (isLoading || !isDataReady) {
    return (
      <Container size="xl">
        <Stack align="center" spacing="xl" mt="xl">
          <Loader size="xl" />
          <Text>Chargement du tableau de bord...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl">
        <Paper p="xl" withBorder>
          <Stack align="center" spacing="md">
            <IconAlertCircle size={48} color="red" />
            <Text size="lg" color="red">
              Une erreur est survenue lors du chargement des données
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const statsData = [
    {
      title: 'Propriétés',
      icon: <IconHome size={24} />,
      mainValue: `${stats.properties.total}`,
      mainLabel: 'propriétés',
      details: [
        {
          label: 'Occupées',
          value: stats.properties.occupied,
          color: 'blue'
        },
        {
          label: 'Disponibles',
          value: stats.properties.available,
          color: 'green'
        },
        {
          label: 'En maintenance',
          value: stats.properties.maintenance,
          color: 'orange'
        }
      ],
      actions: [
        {
          label: 'Ajouter',
          icon: <IconPlus size={14} />,
          onClick: () => navigate('/properties/new'),
          color: 'blue'
        }
      ],
      link: '/properties'
    },
    {
      title: 'Revenus mensuels',
      icon: <IconCash size={24} />,
      mainValue: `${stats.properties.totalRent.toLocaleString()}€`,
      mainLabel: 'attendus',
      details: [
        {
          label: 'Payés',
          value: `${stats.payments.paid.toLocaleString()}€`,
          color: 'teal'
        },
        {
          label: 'En attente',
          value: `${(stats.payments.total - stats.payments.paid).toLocaleString()}€`,
          color: stats.payments.late > 0 ? 'red' : 'orange'
        }
      ],
      trend: stats.trends.payments,
      link: '/payments',
      hideEmptyDetails: true
    },
    {
      title: 'Tickets',
      icon: <IconTicket size={24} />,
      mainValue: `${stats.tickets.open}`,
      mainLabel: 'en cours',
      details: [
        {
          label: 'Urgents',
          value: stats.tickets.urgent,
          color: 'red'
        },
        {
          label: 'En attente',
          value: stats.tickets.open - stats.tickets.urgent,
          color: 'orange'
        },
        {
          label: 'Résolus ce mois',
          value: stats.tickets.resolved,
          color: 'teal'
        }
      ],
      trend: stats.trends.tickets,
      link: '/tickets'
    },
    {
      title: 'Locataires',
      icon: <IconUsers size={24} />,
      mainValue: `${stats.tenants.active}`,
      mainLabel: 'actifs',
      details: [
        {
          label: 'Baux expirant bientôt',
          value: stats.tenants.ending,
          color: 'orange'
        },
        {
          label: 'Taux d\'occupation',
          value: `${Math.round((stats.properties.occupied / stats.properties.total) * 100)}%`,
          color: 'blue'
        }
      ],
      link: '/tenants'
    }
  ];

  return (
    <Container 
      size="xl" 
      px={{ base: 'xs', sm: 'md', lg: 'xl' }}
      sx={(theme) => ({
        [theme.fn.smallerThan('sm')]: {
          padding: theme.spacing.xs,
        },
      })}
    >
      <Box mb={{ base: 'md', sm: 'xl' }}>
        <DashboardHeader />
      </Box>

      <Grid gutter={{ base: 'xs', sm: 'md' }}>
        {/* Colonne principale */}
        <Grid.Col span={12} md={8}>
          <Stack spacing={{ base: 'xs', sm: 'md' }}>
            <StatsGrid data={statsData} />
            <ResponsiveCharts data={stats.chartData} />
          </Stack>
        </Grid.Col>

        {/* Colonne latérale */}
        <Grid.Col span={12} md={4}>
          <Box 
            sx={(theme) => ({
              position: 'static',
              [theme.fn.largerThan('md')]: {
                position: 'sticky',
                top: theme.spacing.md,
              },
            })}
          >
            <AlertsSection 
              alerts={{
                latePayments: stats.payments.late,
                urgentTickets: stats.tickets.urgent,
                expiringLeases: stats.tenants.ending,
                availableProperties: stats.properties.available
              }}
              performance={{
                occupancyRate: Math.round((stats.properties.occupied / stats.properties.total) * 100),
                ticketResolutionRate: Math.round((stats.tickets.resolved / stats.tickets.total) * 100),
                paymentRate: Math.round(stats.payments.paymentRate)
              }}
            />
          </Box>
        </Grid.Col>
      </Grid>

      <Box mt={{ base: 'md', sm: 'xl' }}>
        <DetailedStats 
          stats={{
            occupation: {
              rate: Math.round((stats.properties.occupied / stats.properties.total) * 100),
              total: stats.properties.total,
              occupied: stats.properties.occupied,
              trend: stats.trends.occupancy
            },
            tickets: {
              resolutionRate: Math.round((stats.tickets.resolved / stats.tickets.total) * 100),
              total: stats.tickets.total,
              resolved: stats.tickets.resolved,
              trend: stats.trends.tickets
            },
            payments: {
              onTimeRate: stats.payments.paymentRate,
              total: stats.payments.total,
              onTime: stats.payments.paid,
              trend: stats.trends.payments
            }
          }}
        />
      </Box>
    </Container>
  );
} 