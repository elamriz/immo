import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('VITE_API_URL is not defined in environment variables');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', credentials);
  return data;
};

export const googleAuth = async (token: string): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/google', { token });
  return data;
};