import axios from 'axios';
import { Payment, CreatePaymentDto } from '../types/payment';

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

export const getPayments = async (): Promise<Payment[]> => {
  const { data } = await api.get('/payments');
  return data;
};

export const createPayment = async (payment: CreatePaymentDto): Promise<Payment> => {
  const { data } = await api.post('/payments', payment);
  return data;
};

export const updatePayment = async (id: string, payment: Partial<Payment>): Promise<Payment> => {
  const { data } = await api.patch(`/payments/${id}`, payment);
  return data;
};

export const deletePayment = async (id: string): Promise<void> => {
  await api.delete(`/payments/${id}`);
}; 