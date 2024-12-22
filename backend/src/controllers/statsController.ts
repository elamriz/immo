import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { Payment } from '../models/Payment';
import { Ticket } from '../models/Ticket';
import { Tenant } from '../models/Tenant';
import { addDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

async function getMonthlyStats(userId: string, numberOfMonths: number = 6) {
  const months = Array.from({ length: numberOfMonths }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      month: date.toLocaleString('fr-FR', { month: 'short' })
    };
  }).reverse();

  const properties = await Property.find({ owner: userId });
  const propertyIds = properties.map(p => p._id);

  // Récupérer les données mensuelles
  const monthlyData = await Promise.all(months.map(async ({ start, end, month }) => {
    // Paiements du mois
    const monthPayments = await Payment.find({
      propertyId: { $in: propertyIds },
      dueDate: { $gte: start, $lte: end }
    });

    // Tickets du mois
    const monthTickets = await Ticket.find({
      propertyId: { $in: propertyIds },
      createdAt: { $gte: start, $lte: end }
    });

    // Occupation du mois
    const monthTenants = await Tenant.find({
      propertyId: { $in: propertyIds },
      leaseStartDate: { $lte: end },
      leaseEndDate: { $gte: start }
    });

    return {
      month,
      payments: {
        value: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        total: monthPayments.length,
        onTime: monthPayments.filter(p => p.status === 'paid').length
      },
      tickets: {
        value: monthTickets.length,
        resolved: monthTickets.filter(t => t.status === 'resolved').length
      },
      occupancy: {
        value: Math.round((monthTenants.length / properties.length) * 100)
      }
    };
  }));

  // Calculer les tendances
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const trends = {
    payments: calculateTrend(
      monthlyData[monthlyData.length - 1].payments.onTime,
      monthlyData[monthlyData.length - 2].payments.onTime
    ),
    tickets: calculateTrend(
      monthlyData[monthlyData.length - 1].tickets.resolved,
      monthlyData[monthlyData.length - 2].tickets.resolved
    ),
    occupancy: calculateTrend(
      monthlyData[monthlyData.length - 1].occupancy.value,
      monthlyData[monthlyData.length - 2].occupancy.value
    )
  };

  return {
    monthlyData,
    trends
  };
}

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const userId = req.user._id;

    // Statistiques de base
    const properties = await Property.find({ owner: userId });
    const propertyIds = properties.map(p => p._id);

    // Données mensuelles et tendances
    const { monthlyData, trends } = await getMonthlyStats(userId);

    // Statistiques actuelles
    const currentStats = {
      properties: {
        total: properties.length,
        occupied: properties.filter(p => p.status === 'occupied').length,
        available: properties.filter(p => p.status === 'available').length,
        maintenance: properties.filter(p => p.status === 'maintenance').length,
        totalRent: properties.reduce((sum, p) => sum + p.rentAmount, 0)
      },
      payments: {
        total: monthlyData[monthlyData.length - 1].payments.total,
        paid: monthlyData[monthlyData.length - 1].payments.onTime,
        late: monthlyData[monthlyData.length - 1].payments.total - monthlyData[monthlyData.length - 1].payments.onTime,
        paymentRate: Math.round((monthlyData[monthlyData.length - 1].payments.onTime / monthlyData[monthlyData.length - 1].payments.total) * 100) || 0,
        trend: trends.payments
      },
      tickets: {
        total: monthlyData[monthlyData.length - 1].tickets.value,
        resolved: monthlyData[monthlyData.length - 1].tickets.resolved,
        open: monthlyData[monthlyData.length - 1].tickets.value - monthlyData[monthlyData.length - 1].tickets.resolved,
        trend: trends.tickets
      },
      tenants: {
        total: await Tenant.countDocuments({ propertyId: { $in: propertyIds } }),
        active: await Tenant.countDocuments({ propertyId: { $in: propertyIds }, status: 'active' }),
        ending: await Tenant.countDocuments({
          propertyId: { $in: propertyIds },
          status: 'active',
          leaseEndDate: { $lte: addDays(new Date(), 30) }
        })
      }
    };

    // Formater les données pour les graphiques
    const chartData = {
      payments: monthlyData.map(m => ({ month: m.month, value: m.payments.value })),
      tickets: monthlyData.map(m => ({ month: m.month, value: m.tickets.value })),
      occupancy: monthlyData.map(m => ({ month: m.month, value: m.occupancy.value }))
    };

    return res.json({
      ...currentStats,
      chartData,
      trends
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      message: 'Error fetching dashboard stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 