import { AppShell as MantineAppShell } from '@mantine/core';
import { useNavigate, Outlet } from 'react-router-dom';
import { MainNav } from './MainNav';

export function AppShell() {
  return (
    <MantineAppShell
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <MantineAppShell.Navbar p="md">
        <MantineAppShell.Section>
          <h3>ImmoGestion</h3>
        </MantineAppShell.Section>

        <MantineAppShell.Section grow>
          <MainNav />
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
} 