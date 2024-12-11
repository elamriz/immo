export interface Property {
  _id: string;
  name: string;
  address: string;
  type: 'house' | 'apartment' | 'commercial';
  size: number;
  numberOfRooms: number;
  maxTenants: number;
  rentAmount: number;
  description?: string;
  status: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
  images?: string[];
  owner: string;
}

export interface CreatePropertyDto extends Omit<Property, '_id' | 'owner'> {} 