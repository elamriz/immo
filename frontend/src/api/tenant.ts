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
  const token = localStorage.getItem('auth-storage');
  if (token) {
    const parsedToken = JSON.parse(token).state.token;
    config.headers.Authorization = `Bearer ${parsedToken}`;
  }
  return config;
});

export const getTenants = async (propertyId: string): Promise<Tenant[]> => {
  const { data } = await api.get(`/tenants?propertyId=${propertyId}`);
  return data;
};

export const getTenantById = async (id: string): Promise<Tenant> => {
  const { data } = await api.get(`/tenants/${id}`);
  return data;
};

export const createTenant = async (tenant: CreateTenantDto): Promise<Tenant> => {
  const { data } = await api.post('/tenants', tenant);
  return data;
};

export const updateTenant = async (tenant: Tenant): Promise<Tenant> => {
  const { data } = await api.patch(`/tenants/${tenant._id}`, tenant);
  return data;
};

export const deleteTenant = async (id: string): Promise<void> => {
  await api.delete(`/tenants/${id}`);
}; 