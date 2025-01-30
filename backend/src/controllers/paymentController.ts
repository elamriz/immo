import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';
import { sendPaymentConfirmationEmail, sendPaymentReminderEmail } from '../services/emailService';
import { generateReceiptPDF } from '../services/pdfService';
import { populatePayment } from '../types/shared';

// Définir les méthodes
async function createPayment(req: Request, res: Response): Promise<Response> {
  try {
    console.log('=== Début de création de paiement ===');
    console.log('User:', req.user);
    console.log('Body complet:', JSON.stringify(req.body, null, 2));
    
    const { tenantId, amount, dueDate, paymentMethod, reference } = req.body;

    // Validation des données requises
    if (!tenantId || !amount || !dueDate) {
      console.log('❌ Données manquantes:', { tenantId, amount, dueDate });
      return res.status(400).json({ 
        message: 'Données manquantes', 
        required: ['tenantId', 'amount', 'dueDate'],
        received: req.body 
      });
    }

    console.log('✅ Validation des données OK');

    // Vérifier que le locataire existe
    const tenant = await Tenant.findById(tenantId);
    console.log('Recherche du locataire:', tenantId, 'Résultat:', tenant ? '✅ Trouvé' : '❌ Non trouvé');
    
    if (!tenant) {
      return res.status(404).json({ message: 'Locataire non trouvé' });
    }

    // Vérifier que la propriété appartient au propriétaire connecté
    const property = await Property.findOne({
      _id: tenant.propertyId,
      owner: req.user._id
    });

    console.log('Recherche de la propriété:', {
      propertyId: tenant.propertyId,
      userId: req.user._id,
      found: property ? '✅ Trouvé' : '❌ Non trouvé'
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }

    // Créer le paiement
    const payment = new Payment({
      tenantId,
      propertyId: property._id,
      amount: Number(amount),
      dueDate: new Date(dueDate),
      status: 'pending',
      paymentMethod,
      reference
    });

    console.log('Tentative de sauvegarde du paiement:', JSON.stringify(payment, null, 2));

    try {
      const savedPayment = await payment.save();
      console.log('✅ Paiement sauvegardé avec succès:', savedPayment._id);
      
      const populatedPayment = await Payment.findById(savedPayment._id)
        .populate('tenantId', 'firstName lastName')
        .populate('propertyId', 'name');

      console.log('✅ Paiement peuplé:', JSON.stringify(populatedPayment, null, 2));
      
      return res.status(201).json(populatedPayment);
    } catch (saveError) {
      console.error('❌ Erreur lors de la sauvegarde:', saveError);
      throw saveError;
    }
  } catch (error) {
    console.error('❌ Erreur globale:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de la création du paiement', 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

async function getPayments(req: Request, res: Response): Promise<Response> {
  try {
    console.log('Récupération des paiements pour l\'utilisateur:', req.user._id);

    // Récupérer toutes les propriétés de l'utilisateur
    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map(p => p._id);
    
    console.log('Propriétés trouvées:', propertyIds);

    // Récupérer tous les paiements liés à ces propriétés
    const payments = await Payment.find({
      propertyId: { $in: propertyIds }
    })
    .populate('tenantId', 'firstName lastName')
    .populate('propertyId', 'name')
    .sort({ dueDate: -1 });
    
    console.log(`${payments.length} paiements trouvés`);
    
    return res.json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de la récupération des paiements', 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

async function updatePayment(req: Request, res: Response): Promise<Response> {
  try {
    console.log('=== Mise à jour du paiement ===');
    console.log('ID:', req.params.id);
    console.log('Données:', req.body);

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Vérifier que l'utilisateur a le droit de modifier ce paiement
    const property = await Property.findOne({
      _id: payment.propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    // Mise à jour du paiement
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    )
    .populate('tenantId', 'firstName lastName')
    .populate('propertyId', 'name');

    console.log('✅ Paiement mis à jour:', updatedPayment);
    return res.json(updatedPayment);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du paiement',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

async function deletePayment(req: Request, res: Response): Promise<Response> {
  try {
    console.log('=== Suppression du paiement ===');
    console.log('ID:', req.params.id);

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Vérifier que l'utilisateur a le droit de supprimer ce paiement
    const property = await Property.findOne({
      _id: payment.propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Payment.findByIdAndDelete(req.params.id);
    console.log('✅ Paiement supprimé');
    
    return res.json({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return res.status(500).json({
      message: 'Erreur lors de la suppression du paiement',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

// Mettre à jour le statut des paiements en retard
async function updateLatePayments(): Promise<void> {
  try {
    const now = new Date();
    const result = await Payment.updateMany(
      {
        status: 'pending',
        dueDate: { $lt: now },
        paidDate: { $exists: false }
      },
      { $set: { status: 'late' } }
    );
    
    console.log(`✅ ${result.modifiedCount} paiements marqués comme en retard`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des paiements en retard:', error);
  }
}

// Cette fonction pourrait être appelée par un cron job quotidien

async function getPaymentStats(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId } = req.params;
    const query = propertyId ? { propertyId } : {};

    const [payments, latePaments] = await Promise.all([
      Payment.find({ ...query, owner: req.user._id }),
      Payment.find({
        ...query,
        owner: req.user._id,
        status: 'late'
      })
    ]);

    const totalDue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalLate = latePaments.reduce((sum, p) => sum + p.amount, 0);

    const stats = {
      totalDue,
      totalPaid,
      totalLate,
      paymentRate: totalDue > 0 ? (totalPaid / totalDue) * 100 : 0
    };

    return res.json(stats);
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return res.status(500).json({
      message: 'Error fetching payment stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function markAsPaid(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    const [tenant, property] = await Promise.all([
      Tenant.findById(payment.tenantId),
      Property.findOne({ _id: payment.propertyId, owner: req.user._id })
    ]);

    if (!property) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (!tenant) {
      return res.status(404).json({ message: 'Locataire non trouvé' });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      {
        status: 'paid',
        paidDate: new Date(),
      },
      { new: true }
    );

    if (!updatedPayment) {
      throw new Error('Failed to update payment');
    }

    if (tenant.email) {
      const populatedData = populatePayment(updatedPayment, tenant, property);
      await sendPaymentConfirmationEmail(tenant.email, populatedData);
    }

    return res.json(updatedPayment);
  } catch (error) {
    console.error('Error marking payment as paid:', error);
    return res.status(500).json({
      message: 'Error marking payment as paid',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function sendReminder(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    const [tenant, property] = await Promise.all([
      Tenant.findById(payment.tenantId),
      Property.findOne({ _id: payment.propertyId, owner: req.user._id })
    ]);

    if (!property) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (!tenant?.email) {
      return res.status(400).json({ message: 'Email du locataire non disponible' });
    }

    const populatedData = populatePayment(payment, tenant, property);
    await sendPaymentReminderEmail(tenant.email, populatedData);

    // Enregistrer le rappel dans l'historique
    await Payment.findByIdAndUpdate(id, {
      $push: {
        history: {
          action: 'reminder_sent',
          performedBy: req.user._id,
          timestamp: new Date()
        }
      }
    });

    return res.json({ message: 'Rappel envoyé avec succès' });
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    return res.status(500).json({
      message: 'Error sending payment reminder',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function generateReceipt(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);

    if (!payment) {
      res.status(404).json({ message: 'Paiement non trouvé' });
      return;
    }

    const [tenant, property] = await Promise.all([
      Tenant.findById(payment.tenantId),
      Property.findOne({ _id: payment.propertyId, owner: req.user._id })
    ]);

    if (!property) {
      res.status(403).json({ message: 'Non autorisé' });
      return;
    }

    if (!tenant) {
      res.status(404).json({ message: 'Locataire non trouvé' });
      return;
    }

    const populatedData = populatePayment(payment, tenant, property);
    const pdfBuffer = await generateReceiptPDF(populatedData, req.user);

    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=quittance-${payment._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({
      message: 'Error generating receipt',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getPaymentsByProperty(req: Request, res: Response): Promise<Response> {
  try {
    const { propertyId } = req.params;

    // Vérifier que la propriété appartient à l'utilisateur
    const property = await Property.findOne({
      _id: propertyId,
      owner: req.user._id
    });

    if (!property) {
      return res.status(403).json({ message: 'Not authorized to access this property' });
    }

    const payments = await Payment.find({ propertyId })
      .populate('tenantId', 'firstName lastName email')
      .populate('propertyId', 'name')
      .sort({ dueDate: -1 });

    return res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      message: 'Error fetching payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Exporter toutes les méthodes à la fin du fichier
export {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
  updateLatePayments,
  getPaymentStats,
  markAsPaid,
  sendReminder,
  generateReceipt,
  getPaymentsByProperty
}; 