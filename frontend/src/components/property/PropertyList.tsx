import { Grid, Card, Text, Badge, Group, Button, ActionIcon, Stack, Paper } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Property } from '../../types/property';
import { useState } from 'react';
import { EditPropertyModal } from './EditPropertyModal';
import { notifications } from '@mantine/notifications';
import { deleteProperty } from '../../api/property';

interface PropertyListProps {
  properties: Property[];
  onUpdate: (property: Property) => void;
  onDelete: (id: string) => void;
  renderActions?: (property: Property) => React.ReactNode;
}

export function PropertyList({ properties, onUpdate, onDelete, renderActions }: PropertyListProps) {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  return (
    <>
      <Grid>
        {properties.map((property) => (
          <Grid.Col key={property._id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group position="apart" mb="xs">
                <Text fw={500}>{property.name}</Text>
                <Badge color={property.status === 'available' ? 'green' : property.status === 'occupied' ? 'blue' : 'orange'}>
                  {property.status}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" mb="md">
                {property.address}
              </Text>

              <Group position="apart" mb="xs">
                <Text size="sm">Size: {property.size}m²</Text>
                <Text size="sm">Rooms: {property.numberOfRooms}</Text>
              </Group>

              <Text size="sm" fw={500} mb="xs">
                €{property.rentAmount}/month
              </Text>

              {property.amenities.length > 0 && (
                <Group spacing={4} mb="md">
                  {property.amenities.map((amenity) => (
                    <Badge key={amenity} variant="light" size="sm">
                      {amenity}
                    </Badge>
                  ))}
                </Group>
              )}

              <Group position="right">
                {renderActions?.(property)}
                <ActionIcon 
                  color="blue" 
                  onClick={() => {
                    console.log('Editing property:', property);
                    setEditingProperty(property);
                  }}
                >
                  <IconPencil size={16} />
                </ActionIcon>
                <ActionIcon 
                  color="red" 
                  onClick={() => onDelete(property._id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          opened={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
} 