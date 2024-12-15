import { axiosInstance } from './axios';
import { Contractor, CreateContractorDto } from '../types/contractor';

export const getContractors = async (): Promise<Contractor[]> => {
  const response = await axiosInstance.get('/contractors');
  return response.data;
};

export const createContractor = async (contractor: CreateContractorDto): Promise<Contractor> => {
  const response = await axiosInstance.post('/contractors', contractor);
  return response.data;
};

export const updateContractor = async (id: string, contractor: Partial<Contractor>): Promise<Contractor> => {
  const response = await axiosInstance.patch(`/contractors/${id}`, contractor);
  return response.data;
};

export const deleteContractor = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/contractors/${id}`);
};

export const addRating = async (id: string, score: number, comment: string): Promise<Contractor> => {
  const response = await axiosInstance.post(`/contractors/${id}/ratings`, { score, comment });
  return response.data;
};

export const assignContractorToTicket = async (ticketId: string, contractorId: string): Promise<void> => {
  await axiosInstance.post(`/tickets/${ticketId}/assign`, { contractorId });
}; 