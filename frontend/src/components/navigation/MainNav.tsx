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

      {/* Liens pour les propriétaires */}
      {user?.role === 'owner' && (
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

      {/* Liens pour les locataires */}
      {user?.role === 'tenant' && (
        <>
          <NavLink
            label="Mon logement"
            leftSection={<IconBuilding size={20} />}
            active={isActive('/my-property')}
            onClick={() => navigate('/my-property')}
          />

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

      {/* Liens pour les entrepreneurs */}
      {user?.role === 'contractor' && (
        <>
          <NavLink
            label="Mes interventions"
            leftSection={<IconTools size={20} />}
            active={isActive('/my-interventions')}
            onClick={() => navigate('/my-interventions')}
          />

          <NavLink
            label="Tickets en attente"
            leftSection={<IconTicket size={20} />}
            active={isActive('/pending-tickets')}
            onClick={() => navigate('/pending-tickets')}
          />
        </>
      )}

      {/* Liens pour les administrateurs */}
      {user?.role === 'admin' && (
        <>
          <NavLink
            label="Utilisateurs"
            leftSection={<IconUsers size={20} />}
            active={isActive('/users')}
            onClick={() => navigate('/users')}
          />

          <NavLink
            label="Propriétés"
            leftSection={<IconBuilding size={20} />}
            active={isActive('/properties')}
            onClick={() => navigate('/properties')}
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