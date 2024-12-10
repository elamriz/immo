import { NavLink } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function MainNav() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <NavLink label="Dashboard" onClick={() => navigate('/dashboard')} />
      <NavLink label="Properties" onClick={() => navigate('/properties')} />
      <NavLink label="Tenants" onClick={() => navigate('/tenants')} />
      <NavLink label="Payments" onClick={() => navigate('/payments')} />
      <NavLink label="Maintenance" onClick={() => navigate('/maintenance')} />
      <NavLink color="red" label="Logout" onClick={handleLogout} />
    </>
  );
} 