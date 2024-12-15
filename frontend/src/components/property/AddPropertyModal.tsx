import { 
  Modal, TextInput, NumberInput, Select, Textarea, Button, Group, 
  MultiSelect, Stack, Title, Switch, Text, Box, Badge 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { CreatePropertyDto } from '../../types/property';
import { createProperty } from '../../api/property';
import { useMemo } from 'react';

interface AddPropertyModalProps {
  opened: boolean;
  onClose: () => void;
}

export function AddPropertyModal({ opened, onClose }: AddPropertyModalProps) {
  const form = useForm<CreatePropertyDto>({
    initialValues: {
      name: '',
      address: '',
      type: 'apartment',
      size: 0,
      numberOfRooms: 1,
      maxTenants: 1,
      rentAmount: 0,
      description: '',
      status: 'available',
      amenities: [],
      isCoLiving: false,
      coLivingDetails: {
        totalRent: 0,
        maxCoTenants: 2,
        sharedAreas: [],
        commonCharges: {
          internet: 0,
          electricity: 0,
          water: 0,
          heating: 0
        }
      }
    },
    validate: {
      name: (value) => (!value ? 'Le nom est requis' : null),
      address: (value) => (!value ? 'L\'adresse est requise' : null),
      size: (value) => (value <= 0 ? 'La taille doit être supérieure à 0' : null),
      rentAmount: (value) => (value <= 0 ? 'Le loyer doit être supérieur à 0' : null),
      maxTenants: (value) => (value <= 0 ? 'Le nombre de locataires doit être supérieur à 0' : null),
    },
  });

  // Calcul du total des charges
  const totalCharges = useMemo(() => {
    if (!form.values.isCoLiving) return 0;
    const charges = form.values.coLivingDetails.commonCharges;
    return Object.values(charges).reduce((sum, charge) => sum + (charge || 0), 0);
  }, [form.values.coLivingDetails.commonCharges, form.values.isCoLiving]);

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await createProperty(values);
      notifications.show({
        title: 'Succès',
        message: 'Propriété ajoutée avec succès',
        color: 'green',
      });
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de la propriété:', error);
      notifications.show({
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de l\'ajout',
        color: 'red',
      });
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Ajouter une propriété"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing="xl">
          {/* Informations générales */}
          <Box>
            <Title order={4} mb="md">Informations générales</Title>
            <Stack spacing="md">
              <TextInput
                required
                label="Nom de la propriété"
                placeholder="ex: Appartement Centre-ville"
                {...form.getInputProps('name')}
              />
              <TextInput
                required
                label="Adresse"
                placeholder="Adresse complète"
                {...form.getInputProps('address')}
              />
              <Group grow>
                <Select
                  label="Type de bien"
                  data={[
                    { value: 'house', label: 'Maison' },
                    { value: 'apartment', label: 'Appartement' },
                    { value: 'commercial', label: 'Local commercial' },
                  ]}
                  {...form.getInputProps('type')}
                />
                <NumberInput
                  required
                  label="Surface (m²)"
                  min={0}
                  {...form.getInputProps('size')}
                />
              </Group>
              <Group grow>
                <NumberInput
                  required
                  label="Nombre de pièces"
                  min={1}
                  {...form.getInputProps('numberOfRooms')}
                />
                <NumberInput
                  required
                  label="Nombre maximum de locataires"
                  min={1}
                  {...form.getInputProps('maxTenants')}
                />
              </Group>
            </Stack>
          </Box>

          {/* Loyer et charges */}
          <Box>
            <Title order={4} mb="md">Loyer et charges</Title>
            <Stack spacing="md">
              <NumberInput
                required
                label="Loyer total (€/mois)"
                description={form.values.isCoLiving ? "Ce montant sera divisé entre les colocataires" : undefined}
                min={0}
                precision={2}
                {...form.getInputProps('rentAmount')}
              />
              <Switch
                label="Colocation"
                {...form.getInputProps('isCoLiving', { type: 'checkbox' })}
              />
            </Stack>
          </Box>

          {/* Section colocation */}
          {form.values.isCoLiving && (
            <Box>
              <Title order={4} mb="md">Colocation</Title>
              <Stack spacing="md">
                <MultiSelect
                  label="Espaces partagés"
                  data={[
                    { value: 'kitchen', label: 'Cuisine' },
                    { value: 'living_room', label: 'Salon' },
                    { value: 'bathroom', label: 'Salle de bain' },
                    { value: 'laundry', label: 'Buanderie' },
                  ]}
                  placeholder="Sélectionner les espaces partagés"
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Ajouter "${query}"`}
                  {...form.getInputProps('coLivingDetails.sharedAreas')}
                />

                <Box>
                  <Text size="sm" weight={500} mb="xs">Charges communes</Text>
                  <Group grow>
                    <NumberInput
                      label="Internet"
                      min={0}
                      precision={2}
                      {...form.getInputProps('coLivingDetails.commonCharges.internet')}
                    />
                    <NumberInput
                      label="Électricité"
                      min={0}
                      precision={2}
                      {...form.getInputProps('coLivingDetails.commonCharges.electricity')}
                    />
                  </Group>
                  <Group grow mt="xs">
                    <NumberInput
                      label="Eau"
                      min={0}
                      precision={2}
                      {...form.getInputProps('coLivingDetails.commonCharges.water')}
                    />
                    <NumberInput
                      label="Chauffage"
                      min={0}
                      precision={2}
                      {...form.getInputProps('coLivingDetails.commonCharges.heating')}
                    />
                  </Group>
                  <Group position="right" mt="xs">
                    <Badge size="lg">
                      Total charges : {totalCharges.toFixed(2)}€/mois
                    </Badge>
                  </Group>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Autres informations */}
          <Box>
            <Title order={4} mb="md">Autres informations</Title>
            <Stack spacing="md">
              <MultiSelect
                label="Équipements"
                placeholder="Sélectionner les équipements"
                data={[
                  { value: 'parking', label: 'Parking' },
                  { value: 'furnished', label: 'Meublé' },
                  { value: 'aircon', label: 'Climatisation' },
                  { value: 'heating', label: 'Chauffage' },
                  { value: 'garden', label: 'Jardin' },
                  { value: 'elevator', label: 'Ascenseur' },
                ]}
                searchable
                creatable
                getCreateLabel={(query) => `+ Ajouter "${query}"`}
                {...form.getInputProps('amenities')}
              />
              <Textarea
                label="Description"
                placeholder="Description du bien"
                {...form.getInputProps('description')}
              />
            </Stack>
          </Box>

          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={onClose}>Annuler</Button>
            <Button type="submit">Ajouter la propriété</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 