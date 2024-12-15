import { axiosInstance } from './axios';
import { Tenant, CreateTenantDto } from '../types/tenant';

export const getTenants = async (propertyId: string): Promise<Tenant[]> => {
  const response = await axiosInstance.get(`/properties/${propertyId}/tenants`);
  return response.data;
};

export const createTenant = async (propertyId: string, tenant: CreateTenantDto): Promise<Tenant> => {
  const response = await axiosInstance.post(`/properties/${propertyId}/tenants`, tenant);
  return response.data;
};

export const updateTenant = async (id: string, tenant: Partial<Tenant>): Promise<Tenant> => {
  const response = await axiosInstance.put(`/tenants/${id}`, tenant);
  return response.data;
};

export const deleteTenant = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tenants/${id}`);
};

export const getTenantsByProperty = async (propertyId: string): Promise<Tenant[]> => {
  const response = await axiosInstance.get(`/properties/${propertyId}/tenants`);
  return response.data;
}; 