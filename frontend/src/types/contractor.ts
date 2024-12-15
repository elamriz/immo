export interface Contractor {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  specialty: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContractorDto {
  name: string;
  phone: string;
  email?: string;
  specialty: string;
  location?: string;
} 