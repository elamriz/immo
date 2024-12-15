import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  propertyId: mongoose.Types.ObjectId;
  ticketType: 'general' | 'tenant_specific';
  tenantId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedContractor?: mongoose.Types.ObjectId;
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
    enum: ['open', 'assigned', 'in_progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedContractor: {
    type: Schema.Types.ObjectId,
    ref: 'Contractor',
    required: false
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

// Middleware pour mettre à jour le nombre de jobs complétés du réparateur
ticketSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'resolved' && this.assignedContractor) {
    await mongoose.model('Contractor').findByIdAndUpdate(
      this.assignedContractor,
      { $inc: { completedJobs: 1 } }
    );
  }
  next();
});

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema); 