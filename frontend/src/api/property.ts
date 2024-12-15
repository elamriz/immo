import { axiosInstance } from './axios';
import { Property, CreatePropertyDto } from '../types/property';

export const getProperties = async (): Promise<Property[]> => {
  const response = await axiosInstance.get('/properties');
  return response.data;
};

export const getProperty = async (id: string): Promise<Property> => {
  const response = await axiosInstance.get(`/properties/${id}`);
  return response.data;
};

export const createProperty = async (property: CreatePropertyDto): Promise<Property> => {
  const response = await axiosInstance.post('/properties', property);
  return response.data;
};

export const updateProperty = async (id: string, property: Partial<Property>): Promise<Property> => {
  const response = await axiosInstance.patch(`/properties/${id}`, property);
  return response.data;
};

export const deleteProperty = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/properties/${id}`);
};

// Fonctions spécifiques à la colocation
export const getPropertyTenants = async (propertyId: string): Promise<Property['tenants']> => {
  const response = await axiosInstance.get(`/properties/${propertyId}/tenants`);
  return response.data;
};

export const getPropertyPayments = async (propertyId: string): Promise<any[]> => {
  const response = await axiosInstance.get(`/properties/${propertyId}/payments`);
  return response.data;
};

export const getPropertyTickets = async (propertyId: string): Promise<any[]> => {
  const response = await axiosInstance.get(`/properties/${propertyId}/tickets`);
  return response.data;
}; 