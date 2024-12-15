export interface Contractor {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  specialty: string;
  location?: string;
  status: 'active' | 'inactive';
  ratings: {
    score: number;
    comment: string;
    createdBy: string;
    createdAt: Date;
  }[];
  completedJobs: number;
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

export interface Rating {
  score: number;
  comment: string;
} 