export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'owner' | 'tenant' | 'contractor' | 'admin';
    phone: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials extends LoginCredentials {
    firstName: string;
    lastName: string;
    role: 'owner' | 'tenant' | 'contractor';
    phone: string;
  }