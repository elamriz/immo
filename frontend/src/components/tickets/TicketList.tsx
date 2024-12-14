import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  PriorityHigh as HighPriorityIcon,
  Error as MediumPriorityIcon,
  Info as LowPriorityIcon,
  Person as TenantIcon,
  Apartment as BuildingIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  ticketType: 'general' | 'tenant_specific';
  propertyId: {
    _id: string;
    name: string;
  };
  tenantId?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return <HighPriorityIcon color="error" />;
    case 'medium':
      return <MediumPriorityIcon color="warning" />;
    case 'low':
      return <LowPriorityIcon color="info" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'error';
    case 'in_progress':
      return 'warning';
    case 'resolved':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'open':
      return 'Ouvert';
    case 'in_progress':
      return 'En cours';
    case 'resolved':
      return 'Résolu';
    default:
      return status;
  }
};

export const TicketList: React.FC<TicketListProps> = ({ tickets, onTicketClick }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {tickets.map((ticket) => (
        <Card
          key={ticket._id}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              boxShadow: 3,
            },
          }}
          onClick={() => onTicketClick(ticket._id)}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title={ticket.ticketType === 'general' ? "Ticket général" : "Ticket locataire"}>
                    {ticket.ticketType === 'general' ? 
                      <BuildingIcon color="primary" /> : 
                      <TenantIcon color="secondary" />
                    }
                  </Tooltip>
                  <Typography variant="h6" component="div">
                    {ticket.title}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Chip
                    label={getStatusLabel(ticket.status)}
                    color={getStatusColor(ticket.status) as any}
                    size="small"
                  />
                  <Tooltip title={`Priorité ${ticket.priority}`}>
                    <IconButton size="small">
                      {getPriorityIcon(ticket.priority)}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {ticket.description}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.propertyId.name}
                    {ticket.tenantId && ` - ${ticket.tenantId.firstName} ${ticket.tenantId.lastName}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(ticket.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}; 