import { Container, Paper, Title, Text, Button, Group, Card, Stack } from '@mantine/core';
import { IconPlus, IconHome } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { AddPropertyModal } from '../components/property/AddPropertyModal';
import { PropertyList } from '../components/property/PropertyList';
import { Property } from '../types/property';
import { getProperties } from '../api/property';
import { notifications } from '@mantine/notifications';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.userType === 'owner') {
      loadProperties();
    }
  }, [user]);

  const loadProperties = async () => {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load properties',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (user?.userType !== 'owner') {
    return (
      <Container>
        <Title>Welcome, {user?.firstName}!</Title>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="xl">
        <Title>Loading...</Title>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title>My Properties</Title>
        <Button 
          leftSection={<IconPlus size={20} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Property
        </Button>
      </Group>

      {properties.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack gap="xl" align="center">
            <IconHome size={50} style={{ color: 'gray' }} />
            <Card w="100%">
              <Stack gap="md" align="center">
                <Title order={2}>Welcome to Your Property Dashboard!</Title>
                <Text size="lg" c="dimmed" ta="center" maw={600}>
                  As a property owner, you can start managing your properties right away. 
                  Add your first property to begin tracking tenants, payments, and maintenance.
                </Text>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  leftSection={<IconPlus size={20} />}
                  mt="md"
                >
                  Add Your First Property
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Paper>
      ) : (
        <PropertyList 
          properties={properties}
          onUpdate={(updatedProperty) => {
            setProperties(properties.map(p => 
              p.id === updatedProperty.id ? updatedProperty : p
            ));
          }}
          onDelete={(deletedId) => {
            setProperties(properties.filter(p => p.id !== deletedId));
          }}
        />
      )}

      <AddPropertyModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(newProperty) => {
          setProperties([...properties, newProperty]);
          setIsModalOpen(false);
        }}
      />
    </Container>
  );
} 