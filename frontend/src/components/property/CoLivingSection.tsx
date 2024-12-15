import { Switch, NumberInput, MultiSelect, Stack, Text, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

interface CoLivingSectionProps {
  form: ReturnType<typeof useForm>;
}

export function CoLivingSection({ form }: CoLivingSectionProps) {
  return (
    <Stack>
      <Switch
        label="Colocation"
        description="Activer la gestion de colocation pour cette propriété"
        {...form.getInputProps('isCoLiving', { type: 'checkbox' })}
      />

      {form.values.isCoLiving && (
        <>
          <NumberInput
            required
            label="Loyer total"
            description="Montant total du loyer pour la colocation"
            min={0}
            {...form.getInputProps('coLivingDetails.totalRent')}
          />

          <NumberInput
            required
            label="Nombre maximum de colocataires"
            min={2}
            max={10}
            {...form.getInputProps('coLivingDetails.maxCoTenants')}
          />

          <MultiSelect
            label="Espaces partagés"
            data={[
              { value: 'kitchen', label: 'Cuisine' },
              { value: 'livingRoom', label: 'Salon' },
              { value: 'bathroom', label: 'Salle de bain' },
              { value: 'laundry', label: 'Buanderie' },
            ]}
            {...form.getInputProps('coLivingDetails.sharedAreas')}
          />

          <Text size="sm" weight={500} mt="md">Charges communes</Text>
          <Group grow>
            <NumberInput
              label="Internet"
              {...form.getInputProps('coLivingDetails.commonCharges.internet')}
            />
            <NumberInput
              label="Électricité"
              {...form.getInputProps('coLivingDetails.commonCharges.electricity')}
            />
          </Group>
          <Group grow>
            <NumberInput
              label="Eau"
              {...form.getInputProps('coLivingDetails.commonCharges.water')}
            />
            <NumberInput
              label="Chauffage"
              {...form.getInputProps('coLivingDetails.commonCharges.heating')}
            />
          </Group>
        </>
      )}
    </Stack>
  );
} 