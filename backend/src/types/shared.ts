import { Document, Types } from 'mongoose';
import { IPayment } from '../models/Payment';
import { ITenant } from '../models/Tenant';
import { IProperty } from '../models/Property';

// Interface pour l'historique des paiements
interface PaymentHistory {
  action: string;
  performedBy: Types.ObjectId;
  timestamp: Date;
}

// Interface pour le locataire dans le contexte d'un paiement
export interface PopulatedTenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Interface pour la propriété dans le contexte d'un paiement
export interface PopulatedProperty {
  _id: string;
  name: string;
  address: string;
  type: string;
  size: number;
}

// Type de base pour un paiement
type BasePayment = {
  _id: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'late';
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  reference?: string;
  isCoLivingShare: boolean;
  shareDetails?: {
    percentage: number;
    totalRent: number;
    commonCharges: {
      internet?: number;
      electricity?: number;
      water?: number;
      heating?: number;
    };
  };
  history?: PaymentHistory[];
};

// Interface pour le paiement peuplé
export interface PopulatedPayment extends BasePayment {
  tenantId: PopulatedTenant;
  propertyId: PopulatedProperty;
}

// Type pour les documents Mongoose avec les propriétés supplémentaires
type MongooseDocument<T> = Document<unknown, {}, T> & 
  T & 
  Required<{ _id: unknown }> & 
  { __v: number };

export function populatePayment(
  payment: MongooseDocument<IPayment>,
  tenant: MongooseDocument<ITenant>,
  property: MongooseDocument<IProperty>
): PopulatedPayment {
  if (!payment._id || !tenant._id || !property._id) {
    throw new Error('Invalid document: missing _id');
  }

  return {
    _id: payment._id.toString(),
    amount: payment.amount,
    dueDate: payment.dueDate,
    paidDate: payment.paidDate,
    status: payment.status,
    paymentMethod: payment.paymentMethod,
    reference: payment.reference,
    isCoLivingShare: payment.isCoLivingShare || false,
    shareDetails: payment.shareDetails,
    history: payment.history,
    tenantId: {
      _id: tenant._id.toString(),
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone,
    },
    propertyId: {
      _id: property._id.toString(),
      name: property.name,
      address: property.address,
      type: property.type,
      size: property.size,
    }
  };
} 