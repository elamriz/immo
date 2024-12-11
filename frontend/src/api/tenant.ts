import axios from 'axios';
import { Tenant, CreateTenantDto } from '../types/tenant';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTenants = async (): Promise<Tenant[]> => {
  const { data } = await api.get('/tenants');
  return data;
};

export const createTenant = async (tenant: CreateTenantDto): Promise<Tenant> => {
  const { data } = await api.post('/tenants', tenant);
  return data;
};

export const updateTenant = async (id: string, tenant: Partial<Tenant>): Promise<Tenant> => {
  const { data } = await api.patch(`/tenants/${id}`, tenant);
  return data;
};

export const deleteTenant = async (id: string): Promise<void> => {
  await api.delete(`/tenants/${id}`);
}; 