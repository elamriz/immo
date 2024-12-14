import mongoose, { Schema } from 'mongoose';
import { config } from 'dotenv';
import { Property } from '../models/Property';

config();

// Définir le schéma User pour la migration
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
  leaseStartDate: Date,
  leaseEndDate: Date,
  rentAmount: Number,
  depositAmount: Number,
  status: String,
  rentStatus: String
});

// Créer le modèle User si il n'existe pas déjà
const User = mongoose.models.User || mongoose.model('User', userSchema);

interface User {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  propertyId: mongoose.Types.ObjectId;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: string;
  rentStatus: string;
}

interface TenantData {
  userId: mongoose.Types.ObjectId;
  leaseStartDate: Date;
  leaseEndDate?: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'inactive';
  rentStatus: 'pending' | 'paid';
}

async function migrateTenants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Récupérer tous les utilisateurs qui sont des locataires (qui ont un propertyId)
    const tenants = await User.find({ propertyId: { $exists: true } }) as User[];
    console.log(`Found ${tenants.length} tenants to migrate`);

    // Grouper les locataires par propriété
    const tenantsByProperty = tenants.reduce((acc, tenant) => {
      const propertyId = tenant.propertyId.toString();
      if (!acc[propertyId]) {
        acc[propertyId] = [];
      }
      acc[propertyId].push(tenant);
      return acc;
    }, {} as { [key: string]: User[] });

    // Pour chaque propriété, mettre à jour la liste des locataires
    for (const [propertyId, propertyTenants] of Object.entries(tenantsByProperty)) {
      console.log(`Processing property ${propertyId} with ${propertyTenants.length} tenants`);

      const property = await Property.findById(propertyId);
      if (!property) {
        console.log(`Property ${propertyId} not found, skipping`);
        continue;
      }

      // Convertir les locataires au nouveau format
      const newTenants: TenantData[] = propertyTenants.map(tenant => ({
        userId: tenant._id,
        leaseStartDate: tenant.leaseStartDate || new Date(),
        leaseEndDate: tenant.leaseEndDate,
        rentAmount: tenant.rentAmount || property.rentAmount,
        depositAmount: tenant.depositAmount || tenant.rentAmount * 2,
        status: (tenant.status === 'active' || tenant.status === 'inactive') ? tenant.status : 'active',
        rentStatus: (tenant.rentStatus === 'pending' || tenant.rentStatus === 'paid') ? tenant.rentStatus : 'pending'
      }));

      // Mettre à jour la propriété avec les nouveaux locataires
      property.tenants = newTenants;
      if (newTenants.length > 0) {
        property.status = 'occupied';
      }

      await property.save();
      console.log(`Updated property ${propertyId} with ${newTenants.length} tenants`);
    }

    // Optionnel : Supprimer les champs de locataire de la collection User
    const updateResult = await User.updateMany(
      { propertyId: { $exists: true } },
      {
        $unset: {
          propertyId: "",
          leaseStartDate: "",
          leaseEndDate: "",
          rentAmount: "",
          depositAmount: "",
          rentStatus: ""
        }
      }
    );
    console.log('Cleaned up User collection:', updateResult);

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateTenants(); 