import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';
import { Contractor } from '../models/Contractor';
import { Ticket } from '../models/Ticket';
import { Payment } from '../models/Payment';
import { subMonths, startOfMonth, endOfMonth, addMonths, addDays } from 'date-fns';
import bcrypt from 'bcryptjs';

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

// Données des propriétaires
const owners = [
  {
    email: 'marc.dubois@gmail.com',
    password: 'Password123!',
    firstName: 'Marc',
    lastName: 'Dubois',
    phone: '0472123456',
    role: 'owner'
  },
  {
    email: 'sophie.lambert@gmail.com',
    password: 'Password123!',
    firstName: 'Sophie',
    lastName: 'Lambert',
    phone: '0473234567',
    role: 'owner'
  },
  {
    email: 'philippe.vandenberg@gmail.com',
    password: 'Password123!',
    firstName: 'Philippe',
    lastName: 'Van den Berg',
    phone: '0474345678',
    role: 'owner'
  },
  {
    email: 'caroline.lejeune@gmail.com',
    password: 'Password123!',
    firstName: 'Caroline',
    lastName: 'Lejeune',
    phone: '0475456789',
    role: 'owner'
  }
];

// Données des locataires
const tenants = [
  {
    email: 'thomas.peeters@gmail.com',
    password: 'Password123!',
    firstName: 'Thomas',
    lastName: 'Peeters',
    phone: '0476567890',
    role: 'tenant'
  },
  {
    email: 'julie.janssens@gmail.com',
    password: 'Password123!',
    firstName: 'Julie',
    lastName: 'Janssens',
    phone: '0477678901',
    role: 'tenant'
  },
  {
    email: 'lucas.maes@gmail.com',
    password: 'Password123!',
    firstName: 'Lucas',
    lastName: 'Maes',
    phone: '0478789012',
    role: 'tenant'
  },
  {
    email: 'emma.dewit@gmail.com',
    password: 'Password123!',
    firstName: 'Emma',
    lastName: 'De Wit',
    phone: '0479890123',
    role: 'tenant'
  },
  {
    email: 'maxime.laurent@gmail.com',
    password: 'Password123!',
    firstName: 'Maxime',
    lastName: 'Laurent',
    phone: '0470901234',
    role: 'tenant'
  },
  {
    email: 'sarah.claes@gmail.com',
    password: 'Password123!',
    firstName: 'Sarah',
    lastName: 'Claes',
    phone: '0471012345',
    role: 'tenant'
  },
  {
    email: 'nicolas.martin@gmail.com',
    password: 'Password123!',
    firstName: 'Nicolas',
    lastName: 'Martin',
    phone: '0472123456',
    role: 'tenant'
  }
];

// Données des entrepreneurs
const contractors = [
  {
    email: 'david.vandenberg@gmail.com',
    password: 'Password123!',
    firstName: 'David',
    lastName: 'Van den Berg',
    phone: '0473234567',
    role: 'contractor',
    specialty: 'plomberie',
    location: 'Bruxelles',
    completedJobs: 45,
    ratings: [
      { score: 4, comment: 'Travail soigné et professionnel', createdAt: new Date('2023-12-15') },
      { score: 5, comment: 'Excellent service, très réactif', createdAt: new Date('2023-11-20') },
      { score: 4, comment: 'Bon travail, délais respectés', createdAt: new Date('2023-10-05') },
      { score: 5, comment: 'Très satisfait de l\'intervention', createdAt: new Date('2023-09-12') },
      { score: 3, comment: 'Travail correct mais un peu de retard', createdAt: new Date('2023-08-28') },
      { score: 5, comment: 'Parfait, je recommande', createdAt: new Date('2023-07-15') },
      { score: 4, comment: 'Professionnel et efficace', createdAt: new Date('2023-06-20') }
    ]
  },
  {
    email: 'pierre.leroy@gmail.com',
    password: 'Password123!',
    firstName: 'Pierre',
    lastName: 'Leroy',
    phone: '0474345678',
    role: 'contractor',
    specialty: 'electricite',
    location: 'Liège',
    completedJobs: 32,
    ratings: [
      { score: 5, comment: 'Excellent électricien, travail impeccable', createdAt: new Date('2023-12-10') },
      { score: 4, comment: 'Intervention rapide et efficace', createdAt: new Date('2023-11-05') },
      { score: 4, comment: 'Bon travail, prix correct', createdAt: new Date('2023-09-20') },
      { score: 5, comment: 'Très professionnel', createdAt: new Date('2023-08-15') },
      { score: 5, comment: 'Je recommande vivement', createdAt: new Date('2023-07-01') }
    ]
  },
  {
    email: 'jean.dupont@gmail.com',
    password: 'Password123!',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '0475456789',
    role: 'contractor',
    specialty: 'chauffage',
    location: 'Bruxelles',
    completedJobs: 28,
    ratings: [
      { score: 4, comment: 'Bonne intervention, explications claires', createdAt: new Date('2023-12-05') },
      { score: 4, comment: 'Service rapide et efficace', createdAt: new Date('2023-10-15') },
      { score: 5, comment: 'Excellent travail', createdAt: new Date('2023-09-01') },
      { score: 4, comment: 'Professionnel et ponctuel', createdAt: new Date('2023-07-20') },
      { score: 3, comment: 'Travail correct mais un peu cher', createdAt: new Date('2023-06-10') }
    ]
  },
  {
    email: 'michel.carpentier@gmail.com',
    password: 'Password123!',
    firstName: 'Michel',
    lastName: 'Carpentier',
    phone: '0476567890',
    role: 'contractor',
    specialty: 'menuiserie',
    location: 'Gand',
    completedJobs: 37,
    ratings: [
      { score: 5, comment: 'Travail de grande qualité', createdAt: new Date('2023-12-20') },
      { score: 5, comment: 'Excellent artisan', createdAt: new Date('2023-11-15') },
      { score: 4, comment: 'Très satisfait du résultat', createdAt: new Date('2023-10-01') },
      { score: 5, comment: 'Je recommande fortement', createdAt: new Date('2023-08-25') },
      { score: 4, comment: 'Bon travail, délais respectés', createdAt: new Date('2023-07-10') },
      { score: 5, comment: 'Parfait du début à la fin', createdAt: new Date('2023-06-01') }
    ]
  },
  {
    email: 'andre.lemaitre@gmail.com',
    password: 'Password123!',
    firstName: 'André',
    lastName: 'Lemaître',
    phone: '0477678901',
    role: 'contractor',
    specialty: 'peinture',
    location: 'Anvers',
    completedJobs: 41,
    ratings: [
      { score: 4, comment: 'Très bon travail de peinture', createdAt: new Date('2023-12-01') },
      { score: 5, comment: 'Excellent professionnel', createdAt: new Date('2023-11-10') },
      { score: 5, comment: 'Travail soigné et propre', createdAt: new Date('2023-10-05') },
      { score: 4, comment: 'Respect des délais', createdAt: new Date('2023-09-15') },
      { score: 4, comment: 'Bon rapport qualité/prix', createdAt: new Date('2023-08-01') },
      { score: 5, comment: 'Je recommande', createdAt: new Date('2023-07-05') },
      { score: 5, comment: 'Très satisfait', createdAt: new Date('2023-06-15') }
    ]
  }
];

// Données des propriétés
const properties = [
  {
    name: 'Appartement Moderne Ixelles',
    address: '45 Avenue Louise, 1050 Ixelles',
    type: 'apartment',
    size: 85,
    numberOfRooms: 2,
    maxTenants: 2,
    rentAmount: 1200,
    description: 'Bel appartement rénové proche des transports',
    status: 'occupied',
    amenities: ['parking', 'elevator', 'terrace']
  },
  {
    name: 'Maison Familiale Uccle',
    address: '23 Rue du Château d\'Eau, 1180 Uccle',
    type: 'house',
    size: 180,
    numberOfRooms: 4,
    maxTenants: 4,
    rentAmount: 2200,
    description: 'Grande maison avec jardin dans quartier calme',
    status: 'available',
    amenities: ['garden', 'parking', 'storage']
  },
  {
    name: 'Studio Centre-Ville Liège',
    address: '12 Rue Saint-Gilles, 4000 Liège',
    type: 'apartment',
    size: 45,
    numberOfRooms: 1,
    maxTenants: 1,
    rentAmount: 650,
    description: 'Studio moderne en plein centre',
    status: 'occupied',
    amenities: ['furnished']
  },
  {
    name: 'Duplex Schaerbeek',
    address: '78 Avenue Rogier, 1030 Schaerbeek',
    type: 'apartment',
    size: 120,
    numberOfRooms: 3,
    maxTenants: 3,
    rentAmount: 1500,
    description: 'Magnifique duplex avec vue dégagée',
    status: 'occupied',
    amenities: ['parking', 'terrace', 'storage', 'elevator']
  },
  {
    name: 'Loft Industriel Molenbeek',
    address: '156 Rue de l\'Avenir, 1080 Molenbeek',
    type: 'apartment',
    size: 95,
    numberOfRooms: 2,
    maxTenants: 2,
    rentAmount: 1100,
    description: 'Loft industriel rénové dans ancien atelier',
    status: 'maintenance',
    amenities: ['parking', 'high_ceiling', 'storage']
  },
  {
    name: 'Villa Moderne Waterloo',
    address: '34 Avenue des Roses, 1410 Waterloo',
    type: 'house',
    size: 220,
    numberOfRooms: 5,
    maxTenants: 5,
    rentAmount: 2800,
    description: 'Villa contemporaine avec grand jardin',
    status: 'available',
    amenities: ['garden', 'parking', 'terrace', 'storage', 'security']
  },
  {
    name: 'Studio Etudiant Louvain',
    address: '90 Rue de l\'Université, 3000 Louvain',
    type: 'apartment',
    size: 35,
    numberOfRooms: 1,
    maxTenants: 1,
    rentAmount: 550,
    description: 'Studio idéal pour étudiant',
    status: 'occupied',
    amenities: ['furnished', 'internet']
  },
  {
    name: 'Penthouse Anvers',
    address: '12 Meir, 2000 Anvers',
    type: 'apartment',
    size: 150,
    numberOfRooms: 3,
    maxTenants: 2,
    rentAmount: 2500,
    description: 'Penthouse luxueux avec vue panoramique',
    status: 'available',
    amenities: ['parking', 'terrace', 'elevator', 'security', 'storage']
  }
];

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

    // Créer les utilisateurs
    const createdOwners = await Promise.all(
      owners.map(async (owner) => {
        return User.create(owner);
      })
    );

    const createdTenants = await Promise.all(
      tenants.map(async (tenant) => {
        return User.create(tenant);
      })
    );

    const createdContractors = await Promise.all(
      contractors.map(async (contractor) => {
        const user = await User.create(contractor);
        const ownerIds = createdOwners.map(owner => owner._id);
        const ratingsWithOwners = contractor.ratings.map(rating => ({
          ...rating,
          createdBy: ownerIds[Math.floor(Math.random() * ownerIds.length)]
        }));
        
        return Contractor.create({
          name: `${contractor.firstName} ${contractor.lastName}`,
          phone: contractor.phone,
          email: contractor.email,
          specialty: contractor.specialty,
          location: contractor.location,
          status: 'active',
          completedJobs: contractor.completedJobs,
          ratings: ratingsWithOwners
        });
      })
    );

    // Créer les propriétés
    const createdProperties = await Promise.all(
      properties.map((property, index) => {
        return Property.create({
          ...property,
          owner: createdOwners[index % createdOwners.length]._id
        });
      })
    );

    // Créer les baux
    const leases = [
      {
        propertyId: createdProperties[0]._id,
        userId: createdTenants[0]._id,
        firstName: createdTenants[0].firstName,
        lastName: createdTenants[0].lastName,
        email: createdTenants[0].email,
        phone: createdTenants[0].phone,
        leaseStartDate: new Date('2024-01-01'),
        leaseEndDate: new Date('2024-12-31'),
        rentAmount: 1200,
        depositAmount: 2400,
        status: 'active'
      },
      {
        propertyId: createdProperties[2]._id,
        userId: createdTenants[1]._id,
        firstName: createdTenants[1].firstName,
        lastName: createdTenants[1].lastName,
        email: createdTenants[1].email,
        phone: createdTenants[1].phone,
        leaseStartDate: new Date('2024-02-01'),
        leaseEndDate: new Date('2025-01-31'),
        rentAmount: 650,
        depositAmount: 1300,
        status: 'active'
      },
      {
        propertyId: createdProperties[3]._id,
        userId: createdTenants[2]._id,
        firstName: createdTenants[2].firstName,
        lastName: createdTenants[2].lastName,
        email: createdTenants[2].email,
        phone: createdTenants[2].phone,
        leaseStartDate: new Date('2023-09-01'),
        leaseEndDate: new Date('2024-08-31'),
        rentAmount: 1500,
        depositAmount: 3000,
        status: 'active'
      },
      {
        propertyId: createdProperties[6]._id,
        userId: createdTenants[3]._id,
        firstName: createdTenants[3].firstName,
        lastName: createdTenants[3].lastName,
        email: createdTenants[3].email,
        phone: createdTenants[3].phone,
        leaseStartDate: new Date('2023-09-15'),
        leaseEndDate: new Date('2024-09-14'),
        rentAmount: 550,
        depositAmount: 1100,
        status: 'active'
      }
    ];

    const createdLeases = await Promise.all(
      leases.map((lease) => Tenant.create(lease))
    );

    // Créer des tickets variés
    const tickets = [
      {
        propertyId: createdProperties[0]._id,
        tenantId: createdTenants[0]._id,
        title: 'Problème de chauffage',
        description: 'Le radiateur de la chambre ne fonctionne plus',
        status: 'open',
        priority: 'high',
        ticketType: 'tenant_specific',
        assignedContractor: createdContractors[2]._id
      },
      {
        propertyId: createdProperties[2]._id,
        tenantId: createdTenants[1]._id,
        title: 'Problème électrique',
        description: 'Les prises de la cuisine ne fonctionnent plus',
        status: 'in_progress',
        priority: 'medium',
        ticketType: 'tenant_specific',
        assignedContractor: createdContractors[1]._id
      },
      {
        propertyId: createdProperties[3]._id,
        tenantId: createdTenants[2]._id,
        title: 'Fuite d\'eau salle de bain',
        description: 'Fuite importante sous le lavabo',
        status: 'open',
        priority: 'high',
        ticketType: 'tenant_specific',
        assignedContractor: createdContractors[0]._id
      },
      {
        propertyId: createdProperties[4]._id,
        title: 'Rénovation peinture',
        description: 'Rafraîchissement des murs nécessaire',
        status: 'in_progress',
        priority: 'low',
        ticketType: 'general',
        assignedContractor: createdContractors[4]._id
      },
      {
        propertyId: createdProperties[6]._id,
        tenantId: createdTenants[3]._id,
        title: 'Problème de serrure',
        description: 'La serrure de la porte d\'entrée est difficile à ouvrir',
        status: 'resolved',
        priority: 'medium',
        ticketType: 'tenant_specific',
        assignedContractor: createdContractors[3]._id
      }
    ];

    const createdTickets = await Promise.all(
      tickets.map((ticket) => Ticket.create(ticket))
    );

    // Créer l'historique des paiements
    const startDate = new Date('2023-07-01');
    const payments = [];

    for (const lease of createdLeases) {
      let currentDate = new Date(startDate);
      while (currentDate <= new Date()) {
        const isLate = Math.random() < 0.15; // 15% de chance d'être en retard
        payments.push({
          tenantId: lease.userId,
          propertyId: lease.propertyId,
          amount: lease.rentAmount,
          dueDate: currentDate,
          status: isLate ? 'late' : 'paid',
          paidDate: isLate ? addDays(currentDate, Math.floor(Math.random() * 10) + 1) : currentDate,
          paymentMethod: 'bank_transfer'
        });
        currentDate = addMonths(currentDate, 1);
      }
    }

    await Payment.create(payments);

    console.log('Base de données peuplée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données:', error);
    process.exit(1);
  }
};

seedDatabase(); 