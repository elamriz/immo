import axios from 'axios';
import { Property, CreatePropertyDto } from '../types/property';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProperties = async (): Promise<Property[]> => {
  const { data } = await api.get('/properties');
  return data;
};

export const getPropertyById = async (id: string): Promise<Property> => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export const createProperty = async (property: CreatePropertyDto): Promise<Property> => {
  const { data } = await api.post('/properties', property);
  return data;
};

export const updateProperty = async (id: string, property: Partial<Property>): Promise<Property> => {
  const { data } = await api.patch(`/properties/${id}`, property);
  return data;
};

export const deleteProperty = async (id: string): Promise<void> => {
  await api.delete(`/properties/${id}`);
}; 