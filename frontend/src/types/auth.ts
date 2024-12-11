export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'user';
    userType: 'owner' | 'tenant' | 'contractor';
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
    userType: 'owner' | 'tenant' | 'contractor';
  }