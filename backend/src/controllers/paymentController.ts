import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';

// Exporter toutes les méthodes
export {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
  updateLatePayments,
};

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

// Autres méthodes du contrôleur... 