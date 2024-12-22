import { useQuery, useQueryClient } from 'react-query';
import { axiosInstance } from '../api/axios';
import { DashboardStats } from '../types/dashboard';
import { useEffect } from 'react';

const defaultStats: DashboardStats = {
  properties: {
    total: 0,
    occupied: 0,
    available: 0,
    maintenance: 0,
    totalRent: 0
  },
  payments: {
    total: 0,
    paid: 0,
    late: 0,
    paymentRate: 0,
    trend: 0
  },
  tickets: {
    total: 0,
    resolved: 0,
    open: 0,
    urgent: 0,
    trend: 0
  },
  tenants: {
    total: 0,
    active: 0,
    ending: 0
  },
  chartData: {
    payments: [],
    tickets: [],
    occupancy: []
  },
  trends: {
    payments: 0,
    tickets: 0,
    occupancy: 0
  }
};

export const useDashboardStats = () => {
  const queryClient = useQueryClient();

  // Précharger les données nécessaires
  const prefetchData = async () => {
    try {
      // Précharger les données du tableau de bord
      const dashboardResponse = await axiosInstance.get('/stats/dashboard');
      queryClient.setQueryData('dashboardStats', dashboardResponse.data);

      // Précharger d'autres données si nécessaire
      await Promise.all([
        queryClient.prefetchQuery('properties', () => 
          axiosInstance.get('/properties').then(res => res.data)
        ),
        queryClient.prefetchQuery('tenants', () => 
          axiosInstance.get('/tenants').then(res => res.data)
        ),
        queryClient.prefetchQuery('tickets', () => 
          axiosInstance.get('/tickets').then(res => res.data)
        ),
        queryClient.prefetchQuery('payments', () => 
          axiosInstance.get('/payments').then(res => res.data)
        )
      ]);
    } catch (error) {
      console.error('Error prefetching data:', error);
    }
  };

  // Utiliser useEffect au lieu de React.useEffect
  useEffect(() => {
    prefetchData();
  }, []);

  return useQuery<DashboardStats>('dashboardStats', async () => {
    try {
      const response = await axiosInstance.get('/stats/dashboard');
      return {
        ...defaultStats,
        properties: {
          ...defaultStats.properties,
          ...(response.data.properties || {})
        },
        payments: {
          ...defaultStats.payments,
          ...(response.data.payments || {})
        },
        tickets: {
          ...defaultStats.tickets,
          ...(response.data.tickets || {})
        },
        tenants: {
          ...defaultStats.tenants,
          ...(response.data.tenants || {})
        },
        chartData: {
          ...defaultStats.chartData,
          ...(response.data.chartData || {}),
          payments: response.data.chartData?.payments || [],
          tickets: response.data.chartData?.tickets || [],
          occupancy: response.data.chartData?.occupancy || []
        },
        trends: {
          ...defaultStats.trends,
          ...(response.data.trends || {})
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return defaultStats;
    }
  }, {
    initialData: defaultStats,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });
}; 