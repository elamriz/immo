import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';
import { Contractor } from '../models/Contractor';
import { Ticket } from '../models/Ticket';
import { Payment } from '../models/Payment';
import { subMonths, startOfMonth, endOfMonth, addMonths } from 'date-fns';

dotenv.config();

interface PropertyDocument extends mongoose.Document {
  _id: Types.ObjectId;
  name: string;
  // ... autres propriétés si nécessaire
}

const generateMonthlyData = (months: number) => {
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date)
    };
  }).reverse();
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');

    // Nettoyer la base de données
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Tenant.deleteMany({}),
      Contractor.deleteMany({}),
      Ticket.deleteMany({}),
      Payment.deleteMany({})
    ]);

    // Créer un propriétaire
    const owner = await User.create({
      email: 'owner@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '0611223344',
      role: 'owner',
      userType: 'owner'
    });

    // Créer des propriétés
    const properties = await Property.create([
      {
        name: 'Appartement Paris Centre',
        address: '123 rue de Rivoli, 75001 Paris',
        type: 'apartment',
        size: 75,
        numberOfRooms: 3,
        maxTenants: 2,
        rentAmount: 1800,
        status: 'occupied',
        owner: owner._id,
        amenities: ['parking', 'elevator', 'furnished']
      },
      {
        name: 'Studio Lyon Part-Dieu',
        address: '456 rue Garibaldi, 69003 Lyon',
        type: 'apartment',
        size: 30,
        numberOfRooms: 1,
        maxTenants: 1,
        rentAmount: 800,
        status: 'available',
        owner: owner._id,
        amenities: ['furnished']
      },
      {
        name: 'Maison Bordeaux',
        address: '789 avenue des Chartrons, 33000 Bordeaux',
        type: 'house',
        size: 120,
        numberOfRooms: 5,
        maxTenants: 4,
        rentAmount: 2200,
        status: 'occupied',
        owner: owner._id,
        amenities: ['parking', 'garden']
      },
      {
        name: 'Loft Marseille',
        address: '101 rue de la République, 13001 Marseille',
        type: 'apartment',
        size: 85,
        numberOfRooms: 3,
        maxTenants: 2,
        rentAmount: 1500,
        status: 'maintenance',
        owner: owner._id,
        amenities: ['parking', 'aircon']
      }
    ]) as PropertyDocument[];

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
          { score: 5, comment: 'Excellent travail', createdBy: owner._id, createdAt: new Date() }
        ]
      },
      {
        name: 'Marie Électricité',
        phone: '0623456789',
        email: 'marie@electricite.fr',
        specialty: 'electricite',
        location: 'Lyon',
        status: 'active',
        completedJobs: 8
      },
      {
        name: 'Pierre Chauffage',
        phone: '0634567890',
        email: 'pierre@chauffage.fr',
        specialty: 'chauffage',
        location: 'Bordeaux',
        status: 'active',
        completedJobs: 12
      }
    ]);

    // Créer des locataires
    const tenants = await Tenant.create([
      {
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@test.com',
        phone: '0612345678',
        propertyId: properties[0]._id,
        leaseStartDate: subMonths(new Date(), 6),
        leaseEndDate: addMonths(new Date(), 6),
        rentAmount: 1800,
        depositAmount: 1800,
        status: 'active'
      },
      {
        firstName: 'Bob',
        lastName: 'Dupont',
        email: 'bob@test.com',
        phone: '0623456789',
        propertyId: properties[2]._id,
        leaseStartDate: subMonths(new Date(), 3),
        leaseEndDate: addMonths(new Date(), 9),
        rentAmount: 2200,
        depositAmount: 2200,
        status: 'active'
      },
      {
        firstName: 'Charlie',
        lastName: 'Durand',
        email: 'charlie@test.com',
        phone: '0634567890',
        propertyId: properties[2]._id,
        leaseStartDate: subMonths(new Date(), 12),
        leaseEndDate: addMonths(new Date(), 1), // Bail qui expire bientôt
        rentAmount: 2200,
        depositAmount: 2200,
        status: 'active'
      }
    ]);

    // Générer 6 mois de données historiques
    const monthlyData = generateMonthlyData(6);

    // Créer des paiements historiques avec différents statuts
    for (const tenant of tenants) {
      for (const month of monthlyData) {
        const isLate = Math.random() < 0.2; // 20% de chance d'être en retard
        await Payment.create({
          tenantId: tenant._id,
          propertyId: tenant.propertyId,
          amount: tenant.rentAmount,
          dueDate: month.start,
          status: isLate ? 'late' : 'paid',
          paidDate: isLate ? null : month.start,
          paymentMethod: 'bank_transfer'
        });
      }
    }

    // Créer des tickets historiques avec différents statuts et priorités
    const ticketPriorities = ['low', 'medium', 'high'];
    const ticketTypes = ['general', 'tenant_specific'];
    const ticketTitles = [
      'Problème de chauffage',
      'Fuite d\'eau',
      'Panne électrique',
      'Serrure bloquée',
      'Problème de ventilation'
    ];

    for (const property of properties) {
      const propertyTenants = tenants.filter(t => 
        t.propertyId.toString() === property._id.toString()
      );
      
      for (const month of monthlyData) {
        const randomStatus = ['open', 'in_progress', 'resolved'][Math.floor(Math.random() * 3)];
        const randomPriority = ticketPriorities[Math.floor(Math.random() * ticketPriorities.length)];
        const randomType = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
        const randomTitle = ticketTitles[Math.floor(Math.random() * ticketTitles.length)];
        const randomContractor = contractors[Math.floor(Math.random() * contractors.length)];

        const randomTenant = propertyTenants.length > 0 
          ? propertyTenants[Math.floor(Math.random() * propertyTenants.length)]
          : null;

        await Ticket.create({
          propertyId: property._id,
          title: `${randomTitle} - ${month.start.toLocaleDateString()}`,
          description: 'Description détaillée du problème...',
          status: randomStatus,
          priority: randomPriority,
          ticketType: randomType,
          ...(randomType === 'tenant_specific' && randomTenant 
            ? { tenantId: randomTenant._id }
            : { ticketType: 'general' }),
          assignedContractor: randomStatus !== 'open' ? randomContractor._id : undefined,
          createdAt: month.start
        });
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 