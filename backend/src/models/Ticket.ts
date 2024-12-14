import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  propertyId: mongoose.Types.ObjectId;
  ticketType: 'general' | 'tenant_specific';
  tenantId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: mongoose.Types.ObjectId;
  attachments: string[];
  comments: {
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  history: {
    action: string;
    performedBy: mongoose.Types.ObjectId;
    timestamp: Date;
  }[];
  tenantInfo?: {
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema({
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  ticketType: {
    type: String,
    enum: ['general', 'tenant_specific'],
    required: true
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function(this: any) {
      return this && this.ticketType === 'tenant_specific';
    }
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    type: String
  }],
  comments: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  history: [{
    action: {
      type: String,
      required: true
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Middleware pour peupler automatiquement l'historique lors des modifications
ticketSchema.pre('save', function(next) {
  if (this.isModified()) {
    const changedPaths = this.modifiedPaths();
    changedPaths.forEach(path => {
      if (path !== 'history' && path !== 'updatedAt') {
        this.history.push({
          action: `${path} updated to ${this.get(path)}`,
          performedBy: this.get('updatedBy'), // Vous devrez gérer updatedBy dans vos routes
          timestamp: new Date()
        });
      }
    });
  }
  next();
});

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema); 