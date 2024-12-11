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
  const token = localStorage.getItem('auth-storage');
  if (token) {
    const parsedToken = JSON.parse(token).state.token;
    config.headers.Authorization = `Bearer ${parsedToken}`;
  }
  return config;
});

export const getProperties = async (): Promise<Property[]> => {
  try {
    const { data } = await api.get('/properties');
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id: string): Promise<Property> => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export const createProperty = async (property: CreatePropertyDto): Promise<Property> => {
  try {
    const { data } = await api.post('/properties', property);
    return data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const updateProperty = async (id: string, property: Partial<Property>): Promise<Property> => {
  try {
    console.log('Updating property with ID:', id);
    const { data } = await api.patch(`/properties/${id}`, property);
    return data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    await api.delete(`/properties/${id}`);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
}; 