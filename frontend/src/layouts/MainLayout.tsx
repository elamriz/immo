import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { MainNav } from '../components/navigation/MainNav';

export function MainLayout() {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
    >
      <AppShell.Header p="xs">Immo Project</AppShell.Header>
      <AppShell.Navbar p="xs">
        <MainNav />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
} 