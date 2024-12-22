import { createStyles } from '@mantine/styles';
import { rem } from '@mantine/core';

export const useDashboardStyles = createStyles((theme) => ({
  container: {
    minHeight: '100vh',
    backgroundColor: theme.colorScheme === 'dark' 
      ? theme.colors.dark[8] 
      : theme.colors.gray[0],
  },

  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'transform 200ms ease, box-shadow 200ms ease',
    height: '100%',

    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.md,
    },
  },

  chartCard: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  stickyColumn: {
    position: 'sticky',
    top: theme.spacing.md,
    [theme.fn.smallerThan('md')]: {
      position: 'static',
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
  },

  value: {
    fontSize: rem(32),
    fontWeight: 700,
    lineHeight: 1,
  },

  stat: {
    borderBottom: `${rem(3)} solid`,
    paddingBottom: rem(3),
  },

  statUp: {
    borderColor: theme.colors.teal[5],
    color: theme.colors.teal[5],
  },

  statDown: {
    borderColor: theme.colors.red[5],
    color: theme.colors.red[5],
  },

  paper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
  },
})); 