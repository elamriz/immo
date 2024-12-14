import { Card, Group, Stack, Text, Badge } from '@mantine/core';
import { Property } from '../../types/property';

interface PropertyStatsProps {
  property: Property;
}

export function PropertyStats({ property }: PropertyStatsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'green';
      case 'occupied':
        return 'blue';
      case 'maintenance':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Card withBorder>
      <Stack>
        <Group justify="space-between">
          <Text size="lg" fw={500}>
            {property.name}
          </Text>
          <Badge color={getStatusColor(property.status)}>
            {property.status === 'available' ? 'Disponible' : 
             property.status === 'occupied' ? 'Occupé' : 'En maintenance'}
          </Badge>
        </Group>

        <Group grow>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Surface</Text>
            <Text>{property.size} m²</Text>
          </Stack>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Pièces</Text>
            <Text>{property.numberOfRooms}</Text>
          </Stack>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Loyer mensuel</Text>
            <Text>{property.rentAmount} €</Text>
          </Stack>
        </Group>

        {property.amenities && property.amenities.length > 0 && (
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Équipements</Text>
            <Group gap="xs">
              {property.amenities.map((amenity) => (
                <Badge key={amenity} variant="light" size="sm">
                  {amenity}
                </Badge>
              ))}
            </Group>
          </Stack>
        )}
      </Stack>
    </Card>
  );
} 