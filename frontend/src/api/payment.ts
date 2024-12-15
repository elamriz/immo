import { axiosInstance } from './axios';
import { Payment, CreatePaymentDto } from '../types/payment';

export const createPayment = async (payment: CreatePaymentDto): Promise<Payment> => {
  try {
    console.log('Tentative de création du paiement:', payment);
    const response = await axiosInstance.post('/payments', {
      ...payment,
      dueDate: payment.dueDate.toISOString(),
    });
    console.log('Réponse du serveur:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée:', {
      error,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await axiosInstance.get('/payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const updatePayment = async (id: string, payment: Partial<Payment>): Promise<Payment> => {
  const { data } = await axiosInstance.patch(`/payments/${id}`, payment);
  return data;
};

export const deletePayment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/payments/${id}`);
};

export interface PaymentStats {
  totalDue: number;
  totalPaid: number;
  totalLate: number;
  paymentRate: number;
}

export const getPaymentStats = async (propertyId?: string | null): Promise<PaymentStats> => {
  const response = await axiosInstance.get(
    propertyId ? `/payments/stats/${propertyId}` : '/payments/stats'
  );
  return response.data;
};

export const markPaymentAsPaid = async (id: string): Promise<Payment> => {
  const response = await axiosInstance.post(`/payments/${id}/mark-paid`);
  return response.data;
};

export const sendPaymentReminder = async (id: string): Promise<void> => {
  await axiosInstance.post(`/payments/${id}/send-reminder`);
};

export const generateReceipt = async (id: string): Promise<Blob> => {
  const response = await axiosInstance.get(`/payments/${id}/receipt`, {
    responseType: 'blob'
  });
  return response.data;
};

export const getPropertyPayments = async (propertyId: string): Promise<Payment[]> => {
  const response = await axiosInstance.get(`/payments/property/${propertyId}`);
  return response.data;
};
  