import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { Property, Tenant } from '../../types';
import { useSnackbar } from 'notistack';

interface CreateTicketProps {
  open: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
  properties: Property[];
}

interface TicketFormData {
  propertyId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  ticketType: 'general' | 'tenant_specific';
  tenantId?: string;
}

const initialFormData: TicketFormData = {
  propertyId: '',
  title: '',
  description: '',
  priority: 'medium',
  ticketType: 'general',
};

export const CreateTicket: React.FC<CreateTicketProps> = ({
  open,
  onClose,
  onTicketCreated,
  properties,
}) => {
  const [formData, setFormData] = useState<TicketFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({});
  const { enqueueSnackbar } = useSnackbar();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (formData.propertyId) {
      const property = properties.find(p => p._id === formData.propertyId);
      setSelectedProperty(property || null);
    }
  }, [formData.propertyId, properties]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TicketFormData, string>> = {};
    if (!formData.propertyId) newErrors.propertyId = 'La propriété est requise';
    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (formData.ticketType === 'tenant_specific' && !formData.tenantId) {
      newErrors.tenantId = 'Le locataire est requis pour un ticket spécifique';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du ticket');
      }

      enqueueSnackbar('Ticket créé avec succès', { variant: 'success' });
      onTicketCreated();
      onClose();
      setFormData(initialFormData);
    } catch (error) {
      enqueueSnackbar('Erreur lors de la création du ticket', { variant: 'error' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
    
    // Reset tenant if switching to general ticket
    if (name === 'ticketType' && value === 'general') {
      setFormData(prev => ({ ...prev, tenantId: undefined }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Créer un nouveau ticket</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl error={!!errors.propertyId}>
              <InputLabel>Propriété</InputLabel>
              <Select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                label="Propriété"
              >
                {properties.map((property) => (
                  <MenuItem key={property._id} value={property._id}>
                    {property.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.propertyId && (
                <FormHelperText>{errors.propertyId}</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <InputLabel>Type de ticket</InputLabel>
              <Select
                name="ticketType"
                value={formData.ticketType}
                onChange={handleChange}
                label="Type de ticket"
              >
                <MenuItem value="general">Général (tout l'immeuble)</MenuItem>
                <MenuItem value="tenant_specific">Spécifique à un locataire</MenuItem>
              </Select>
            </FormControl>

            {formData.ticketType === 'tenant_specific' && selectedProperty && (
              <FormControl error={!!errors.tenantId}>
                <InputLabel>Locataire</InputLabel>
                <Select
                  name="tenantId"
                  value={formData.tenantId || ''}
                  onChange={handleChange}
                  label="Locataire"
                >
                  {selectedProperty.tenants?.map((tenant) => (
                    <MenuItem key={tenant.userId} value={tenant.userId}>
                      {tenant.firstName} {tenant.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tenantId && (
                  <FormHelperText>{errors.tenantId}</FormHelperText>
                )}
              </FormControl>
            )}

            <TextField
              name="title"
              label="Titre"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              fullWidth
            />

            <FormControl>
              <InputLabel>Priorité</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priorité"
              >
                <MenuItem value="low">Basse</MenuItem>
                <MenuItem value="medium">Moyenne</MenuItem>
                <MenuItem value="high">Haute</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            Créer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 