import { axiosInstance } from './axios';
import { Property } from '../types/property';
import { Tenant } from '../types/tenant';

export const getProperties = async (): Promise<Property[]> => {
  const { data } = await axiosInstance.get('/properties');
  return data;
};

export const getPropertyById = async (id: string): Promise<Property> => {
  const { data } = await axiosInstance.get(`/properties/${id}`);
  return data;
};

export const getTenants = async (propertyId: string): Promise<Tenant[]> => {
  const { data } = await axiosInstance.get(`/tenants?propertyId=${propertyId}`);
  return data;
};

export const createProperty = async (property: Omit<Property, '_id'>): Promise<Property> => {
  const { data } = await axiosInstance.post('/properties', property);
  return data;
};

export const updateProperty = async (id: string, property: Partial<Property>): Promise<Property> => {
  const { data } = await axiosInstance.patch(`/properties/${id}`, property);
  return data;
};

export const deleteProperty = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/properties/${id}`);
}; 