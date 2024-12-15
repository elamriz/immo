import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';
import { Contractor } from '../models/Contractor';
import { Ticket } from '../models/Ticket';
import { Payment } from '../models/Payment';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');

    // Nettoyer la base de données
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Tenant.deleteMany({}),
      Contractor.deleteMany({}),
      Ticket.deleteMany({}),
      Payment.deleteMany({}),
    ]);
    console.log('Database cleaned');

    // Créer un propriétaire
    const owner = await User.create({
      email: 'owner@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      userType: 'owner',
    });
    console.log('Owner created');

    // Créer des réparateurs
    const contractors = await Contractor.create([
      {
        name: 'Jean Plombier',
        phone: '0612345678',
        email: 'jean@plomberie.fr',
        specialty: 'plomberie',
        location: 'Paris',
        status: 'active',
        completedJobs: 15,
        ratings: [
          { score: 5, comment: 'Excellent travail', createdBy: owner._id, createdAt: new Date() },
          { score: 4, comment: 'Très professionnel', createdBy: owner._id, createdAt: new Date() },
        ],
      },
      {
        name: 'Marie Électricité',
        phone: '0623456789',
        email: 'marie@electricite.fr',
        specialty: 'electricite',
        location: 'Lyon',
        status: 'active',
        completedJobs: 8,
        ratings: [
          { score: 5, comment: 'Rapide et efficace', createdBy: owner._id, createdAt: new Date() },
        ],
      },
      {
        name: 'Pierre Chauffage',
        phone: '0634567890',
        email: 'pierre@chauffage.fr',
        specialty: 'chauffage',
        location: 'Marseille',
        status: 'active',
        completedJobs: 12,
      },
      {
        name: 'Sophie Serrurerie',
        phone: '0645678901',
        email: 'sophie@serrurerie.fr',
        specialty: 'serrurerie',
        location: 'Paris',
        status: 'active',
        completedJobs: 20,
      },
      {
        name: 'Luc Menuiserie',
        phone: '0656789012',
        email: 'luc@menuiserie.fr',
        specialty: 'menuiserie',
        location: 'Lyon',
        status: 'active',
        completedJobs: 6,
      },
    ]);
    console.log('Contractors created');

    // Créer des propriétés
    const properties = await Property.create([
      {
        name: 'Appartement Paris Centre',
        address: '123 rue de Rivoli, 75001 Paris',
        type: 'apartment',
        size: 75,
        numberOfRooms: 3,
        maxTenants: 2,
        rentAmount: 1500,
        description: 'Bel appartement au centre de Paris',
        status: 'occupied',
        amenities: ['parking', 'elevator'],
        owner: owner._id,
      },
      {
        name: 'Maison Lyon',
        address: '45 rue Garibaldi, 69003 Lyon',
        type: 'house',
        size: 120,
        numberOfRooms: 5,
        maxTenants: 4,
        rentAmount: 1800,
        description: 'Grande maison avec jardin',
        status: 'occupied',
        amenities: ['parking', 'garden'],
        owner: owner._id,
      },
      {
        name: 'Studio Marseille',
        address: '78 La Canebière, 13001 Marseille',
        type: 'apartment',
        size: 30,
        numberOfRooms: 1,
        maxTenants: 1,
        rentAmount: 600,
        description: 'Studio proche du vieux port',
        status: 'available',
        amenities: ['furnished'],
        owner: owner._id,
      },
    ]);
    console.log('Properties created');

    // Créer des locataires
    const tenants = await Tenant.create([
      {
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@test.com',
        phone: '0712345678',
        propertyId: properties[0]._id,
        leaseStartDate: new Date('2023-01-01'),
        leaseEndDate: new Date('2024-01-01'),
        rentAmount: 1500,
        depositAmount: 1500,
        status: 'active',
        rentStatus: 'paid',
      },
      {
        firstName: 'Bob',
        lastName: 'Dupont',
        email: 'bob@test.com',
        phone: '0723456789',
        propertyId: properties[1]._id,
        leaseStartDate: new Date('2023-03-01'),
        leaseEndDate: new Date('2024-03-01'),
        rentAmount: 1800,
        depositAmount: 1800,
        status: 'active',
        rentStatus: 'paid',
      },
    ]);
    console.log('Tenants created');

    // Créer des tickets
    await Ticket.create([
      {
        propertyId: properties[0]._id,
        title: 'Fuite d\'eau salle de bain',
        description: 'Fuite importante sous le lavabo',
        status: 'assigned',
        priority: 'high',
        ticketType: 'tenant_specific',
        tenantId: tenants[0]._id,
        assignedContractor: contractors[0]._id,
        comments: [
          {
            author: owner._id,
            content: 'Un plombier va intervenir rapidement',
            createdAt: new Date(),
          },
        ],
      },
      {
        propertyId: properties[1]._id,
        title: 'Problème chauffage',
        description: 'Le chauffage ne fonctionne plus',
        status: 'in_progress',
        priority: 'medium',
        ticketType: 'tenant_specific',
        tenantId: tenants[1]._id,
        assignedContractor: contractors[2]._id,
      },
      {
        propertyId: properties[0]._id,
        title: 'Serrure cassée',
        description: 'La serrure de la porte d\'entrée est bloquée',
        status: 'resolved',
        priority: 'high',
        ticketType: 'general',
        assignedContractor: contractors[3]._id,
      },
    ]);
    console.log('Tickets created');

    // Créer des paiements
    await Payment.create([
      {
        tenantId: tenants[0]._id,
        propertyId: properties[0]._id,
        amount: 1500,
        dueDate: new Date('2023-12-01'),
        paidDate: new Date('2023-12-01'),
        status: 'paid',
        paymentMethod: 'bank_transfer',
      },
      {
        tenantId: tenants[1]._id,
        propertyId: properties[1]._id,
        amount: 1800,
        dueDate: new Date('2023-12-01'),
        status: 'pending',
      },
    ]);
    console.log('Payments created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 