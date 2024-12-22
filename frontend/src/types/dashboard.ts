export interface DashboardStats {
  properties: {
    total: number;
    occupied: number;
    available: number;
    maintenance: number;
    totalRent: number;
  };
  payments: {
    total: number;
    paid: number;
    late: number;
    paymentRate: number;
    trend: number;
  };
  tickets: {
    total: number;
    resolved: number;
    open: number;
    urgent?: number;
    trend: number;
  };
  tenants: {
    total: number;
    active: number;
    ending: number;
  };
  chartData: {
    payments: Array<{ month: string; value: number }>;
    tickets: Array<{ month: string; value: number }>;
    occupancy: Array<{ month: string; value: number }>;
  };
  trends: {
    payments: number;
    tickets: number;
    occupancy: number;
  };
} 