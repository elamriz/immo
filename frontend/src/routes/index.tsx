import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/navigation/AppShell';
import { Dashboard } from '../pages/Dashboard';
import { Properties } from '../pages/Properties';
import { Tenants } from '../pages/Tenants';
import { Payments } from '../pages/Payments';
import { Tickets } from '../pages/Tickets';
import { Contractors } from '../pages/Contractors';
import { Settings } from '../pages/Settings';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { PrivateRoute } from './PrivateRoute';
import { CreateTicketPage } from '../pages/tickets/CreateTicketPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="properties" element={<Properties />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="payments" element={<Payments />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="properties/:propertyId/tickets/new" element={<CreateTicketPage />} />
        <Route path="contractors" element={<Contractors />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
} 