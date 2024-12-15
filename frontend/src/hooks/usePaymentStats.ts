import { useQuery } from 'react-query';
import { getPaymentStats } from '../api/payment';

export function usePaymentStats(propertyId?: string | null) {
  return useQuery(
    ['paymentStats', propertyId],
    () => getPaymentStats(propertyId),
    {
      enabled: !!propertyId,
      initialData: {
        totalDue: 0,
        totalPaid: 0,
        totalLate: 0,
        paymentRate: 0,
      }
    }
  );
} 