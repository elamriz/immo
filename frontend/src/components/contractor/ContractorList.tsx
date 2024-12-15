import { Grid, Card, Text, Group, Badge, ActionIcon, Menu, Rating } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash, IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
import { Contractor } from '../../types/contractor';
import { useState } from 'react';
import { EditContractorModal } from './EditContractorModal';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from 'react-query';
import { deleteContractor } from '../../api/contractor';

interface ContractorListProps {
  contractors: Contractor[];
}

export function ContractorList({ contractors }: ContractorListProps) {
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(deleteContractor, {
    onSuccess: () => {
      queryClient.invalidateQueries('contractors');
      notifications.show({
        title: 'Succès',
        message: 'Réparateur supprimé avec succès',
        color: 'green',
      });
    },
  });

  const getAverageRating = (contractor: Contractor) => {
    if (!contractor.ratings || contractor.ratings.length === 0) return 0;
    const sum = contractor.ratings.reduce((acc, r) => acc + r.score, 0);
    return sum / contractor.ratings.length;
  };

  return (
    <Grid>
      {contractors.map((contractor) => (
        <Grid.Col key={contractor._id} span={{ base: 12, md: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Text weight={500}>{contractor.name}</Text>
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon>
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item 
                    icon={<IconEdit size={14} />}
                    onClick={() => setEditingContractor(contractor)}
                  >
                    Modifier
                  </Menu.Item>
                  <Menu.Item 
                    icon={<IconTrash size={14} />}
                    color="red"
                    onClick={() => deleteMutation.mutate(contractor._id)}
                  >
                    Supprimer
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            <Badge color="blue" mb="md">
              {contractor.specialty}
            </Badge>

            <Group spacing="xs" mb="xs">
              <IconPhone size={16} />
              <Text size="sm">{contractor.phone}</Text>
            </Group>

            {contractor.email && (
              <Group spacing="xs" mb="xs">
                <IconMail size={16} />
                <Text size="sm">{contractor.email}</Text>
              </Group>
            )}

            {contractor.location && (
              <Group spacing="xs" mb="xs">
                <IconMapPin size={16} />
                <Text size="sm">{contractor.location}</Text>
              </Group>
            )}

            <Group position="apart" mt="md">
              <Rating value={getAverageRating(contractor)} readOnly />
              <Text size="sm" color="dimmed">
                {contractor.completedJobs} travaux effectués
              </Text>
            </Group>
          </Card>
        </Grid.Col>
      ))}

      {editingContractor && (
        <EditContractorModal
          contractor={editingContractor}
          opened={!!editingContractor}
          onClose={() => setEditingContractor(null)}
        />
      )}
    </Grid>
  );
} 