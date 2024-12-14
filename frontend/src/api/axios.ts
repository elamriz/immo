import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error('Error parsing auth storage:', error);
    }
  }
  return config;
});

// Intercepteur pour gérer les erreurs globalement
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    return Promise.reject(error);
  }
);

export default axiosInstance; 