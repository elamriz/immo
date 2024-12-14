import { NavLink } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconDashboard, IconBuilding, IconUsers, IconReceipt, IconTicket, IconTools, IconSettings, IconLogout } from '@tabler/icons-react';
import { useAuthStore } from '../../store/authStore';

export function MainNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <NavLink
        label="Tableau de bord"
        leftSection={<IconDashboard size={20} />}
        active={isActive('/dashboard')}
        onClick={() => navigate('/dashboard')}
      />

      {user?.userType === 'owner' && (
        <>
          <NavLink
            label="Propriétés"
            leftSection={<IconBuilding size={20} />}
            active={isActive('/properties')}
            onClick={() => navigate('/properties')}
          />

          <NavLink
            label="Locataires"
            leftSection={<IconUsers size={20} />}
            active={isActive('/tenants')}
            onClick={() => navigate('/tenants')}
          />

          <NavLink
            label="Paiements"
            leftSection={<IconReceipt size={20} />}
            active={isActive('/payments')}
            onClick={() => navigate('/payments')}
          />

          <NavLink
            label="Tickets"
            leftSection={<IconTicket size={20} />}
            active={isActive('/tickets')}
            onClick={() => navigate('/tickets')}
          />

          <NavLink
            label="Réparateurs"
            leftSection={<IconTools size={20} />}
            active={isActive('/contractors')}
            onClick={() => navigate('/contractors')}
          />
        </>
      )}

      {user?.userType === 'tenant' && (
        <>
          <NavLink
            label="Mes paiements"
            leftSection={<IconReceipt size={20} />}
            active={isActive('/my-payments')}
            onClick={() => navigate('/my-payments')}
          />

          <NavLink
            label="Mes tickets"
            leftSection={<IconTicket size={20} />}
            active={isActive('/my-tickets')}
            onClick={() => navigate('/my-tickets')}
          />
        </>
      )}

      <NavLink
        label="Paramètres"
        leftSection={<IconSettings size={20} />}
        active={isActive('/settings')}
        onClick={() => navigate('/settings')}
      />

      <NavLink
        label="Déconnexion"
        leftSection={<IconLogout size={20} />}
        color="red"
        onClick={handleLogout}
      />
    </>
  );
} 