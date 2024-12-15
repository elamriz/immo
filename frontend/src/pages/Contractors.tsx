import { Container, Title, Button, Group, Paper, Stack, TextInput, Select } from '@mantine/core';
import { IconPlus, IconSearch, IconFilter } from '@tabler/icons-react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getContractors } from '../api/contractor';
import { ContractorList } from '../components/contractor/ContractorList';
import { AddContractorModal } from '../components/contractor/AddContractorModal';

export function Contractors() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  const { data: contractors = [], isLoading } = useQuery('contractors', getContractors);

  // Filtrer les réparateurs
  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = searchTerm === '' || 
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = !specialtyFilter || contractor.specialty === specialtyFilter;
    const matchesLocation = !locationFilter || contractor.location === locationFilter;

    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  // Extraire les options uniques pour les filtres
  const specialties = [...new Set(contractors.map(c => c.specialty))];
  const locations = [...new Set(contractors.filter(c => c.location).map(c => c.location))];

  return (
    <Container size="xl">
      <Group position="apart" mb="xl">
        <Title>Réparateurs</Title>
        <Button
          leftIcon={<IconPlus size={20} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Ajouter un réparateur
        </Button>
      </Group>

      <Paper p="md" mb="lg" withBorder>
        <Group grow>
          <TextInput
            placeholder="Rechercher un réparateur..."
            icon={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Group>
            <Select
              placeholder="Spécialité"
              icon={<IconFilter size={16} />}
              clearable
              data={specialties.map(s => ({ value: s, label: s }))}
              value={specialtyFilter}
              onChange={setSpecialtyFilter}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Localisation"
              icon={<IconFilter size={16} />}
              clearable
              data={locations.map(l => ({ value: l, label: l }))}
              value={locationFilter}
              onChange={setLocationFilter}
              style={{ width: 200 }}
            />
          </Group>
        </Group>
      </Paper>

      {isLoading ? (
        <Paper p="xl" withBorder>
          <Stack align="center">
            <Title order={2}>Chargement...</Title>
          </Stack>
        </Paper>
      ) : filteredContractors.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center">
            <Title order={2}>Aucun réparateur trouvé</Title>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<IconPlus size={20} />}
            >
              Ajouter un réparateur
            </Button>
          </Stack>
        </Paper>
      ) : (
        <ContractorList contractors={filteredContractors} />
      )}

      <AddContractorModal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
} 