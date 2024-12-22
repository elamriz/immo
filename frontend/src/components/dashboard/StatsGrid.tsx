import { Paper, Text, Group, Stack, Badge, ActionIcon, Tooltip, Button, SimpleGrid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconFilter, IconAlertCircle } from '@tabler/icons-react';

interface StatDetail {
  label: string;
  value: number | string;
  color: string;
}

interface ActionButton {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  mainValue: string;
  mainLabel: string;
  details: StatDetail[];
  trend?: number;
  link?: string;
  actions?: ActionButton[];
  hideEmptyDetails?: boolean;
}

export function StatsGrid({ data }: { data: StatCardProps[] }) {
  const navigate = useNavigate();

  const getValueColor = (value: number, thresholds?: { warning: number; danger: number }) => {
    if (!thresholds) return undefined;
    if (value <= thresholds.danger) return 'red';
    if (value <= thresholds.warning) return 'orange';
    return 'teal';
  };

  return (
    <SimpleGrid
      cols={4}
      spacing="lg"
      breakpoints={[
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'sm', cols: 1 }
      ]}
    >
      {data.map((stat, index) => (
        <Paper
          key={index}
          withBorder
          p="md"
          radius="md"
          sx={(theme) => ({
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            transition: 'transform 200ms ease, box-shadow 200ms ease',
            cursor: stat.link ? 'pointer' : 'default',
            '&:hover': stat.link ? {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows.md,
            } : {},
            [theme.fn.smallerThan('sm')]: {
              padding: theme.spacing.sm,
            },
          })}
        >
          <Group position="apart" mb="xs">
            <Text 
              size="xs" 
              color="dimmed" 
              weight={700} 
              transform="uppercase"
              sx={(theme) => ({
                [theme.fn.smallerThan('sm')]: {
                  fontSize: theme.fontSizes.xs * 0.9,
                },
              })}
            >
              {stat.title}
            </Text>
            {stat.icon}
          </Group>

          <Group 
            align="flex-end" 
            spacing="xs" 
            mb="md"
            sx={(theme) => ({
              [theme.fn.smallerThan('sm')]: {
                flexDirection: 'column',
                alignItems: 'flex-start',
              },
            })}
          >
            <Text 
              size="xl" 
              weight={700}
              sx={(theme) => ({
                fontSize: theme.fontSizes.xl * 1.2,
                [theme.fn.smallerThan('sm')]: {
                  fontSize: theme.fontSizes.xl,
                },
              })}
            >
              {stat.mainValue}
            </Text>
            <Text size="sm" color="dimmed">
              {stat.mainLabel}
            </Text>
          </Group>

          {stat.trend !== undefined && (
            <Tooltip 
              label={`${Math.abs(stat.trend)}% ${stat.trend >= 0 ? 'de plus' : 'de moins'} que le mois dernier`}
              position="top"
            >
              <Text
                mt="sm"
                size="sm"
                color={stat.trend > 0 ? 'teal' : stat.trend < 0 ? 'red' : 'dimmed'}
                weight={500}
              >
                {stat.trend > 0 ? '+' : ''}{stat.trend}% vs mois dernier
              </Text>
            </Tooltip>
          )}

          <Stack spacing={4} mt="auto">
            {stat.details
              .filter(detail => !stat.hideEmptyDetails || (detail.value !== 0 && detail.value !== '0'))
              .map((detail, idx) => (
                <Tooltip
                  key={idx}
                  label={stat.link ? "Cliquez pour filtrer" : undefined}
                  disabled={!stat.link}
                >
                  <Group 
                    position="apart" 
                    sx={(theme) => ({
                      cursor: stat.link ? 'pointer' : 'default',
                      padding: theme.spacing.xs,
                      borderRadius: theme.radius.sm,
                      '&:hover': stat.link ? {
                        backgroundColor: theme.colorScheme === 'dark' 
                          ? theme.colors.dark[6] 
                          : theme.colors.gray[0],
                      } : {},
                    })}
                    onClick={() => stat.link && navigate(`${stat.link}?filter=${detail.label}`)}
                  >
                    <Text size="xs" color="dimmed">{detail.label}</Text>
                    <Badge 
                      size="sm" 
                      color={detail.color}
                      variant={detail.value === 0 ? 'light' : 'filled'}
                      sx={(theme) => ({
                        minWidth: '60px',
                        textAlign: 'center',
                      })}
                    >
                      {typeof detail.value === 'number' && isNaN(detail.value) ? '0' : detail.value}
                    </Badge>
                  </Group>
                </Tooltip>
              ))}
          </Stack>

          {stat.actions && stat.actions.length > 0 && (
            <Group 
              position="right" 
              mt="md"
              sx={(theme) => ({
                [theme.fn.smallerThan('sm')]: {
                  position: 'relative',
                  width: '100%',
                  justifyContent: 'stretch',
                  '& > *': {
                    flex: 1,
                  },
                },
              })}
            >
              {stat.actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="light"
                  size="xs"
                  leftIcon={action.icon}
                  color={action.color}
                  onClick={action.onClick}
                  fullWidth={window.innerWidth <= 768}
                >
                  {action.label}
                </Button>
              ))}
            </Group>
          )}
        </Paper>
      ))}
    </SimpleGrid>
  );
} 