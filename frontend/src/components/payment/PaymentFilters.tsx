import { Group, Select, SegmentedControl, Paper } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconFilter } from '@tabler/icons-react';

interface PaymentFiltersProps {
  propertyId: string | null;
  status: string | null;
  month: Date | null;
  onPropertyChange: (value: string | null) => void;
  onStatusChange: (value: string | null) => void;
  onMonthChange: (value: Date | null) => void;
  properties: { _id: string; name: string }[];
}

export function PaymentFilters({
  propertyId,
  status,
  month,
  onPropertyChange,
  onStatusChange,
  onMonthChange,
  properties,
}: PaymentFiltersProps) {
  return (
    <Paper withBorder p="md" mb="md">
      <Group>
        <Select
          placeholder="Filtrer par propriété"
          data={[
            { value: '', label: 'Toutes les propriétés' },
            ...properties.map(p => ({ value: p._id, label: p.name }))
          ]}
          value={propertyId}
          onChange={onPropertyChange}
          style={{ width: 200 }}
          clearable
          icon={<IconFilter size={14} />}
        />

        <SegmentedControl
          value={status || 'all'}
          onChange={(value) => onStatusChange(value === 'all' ? null : value)}
          data={[
            { label: 'Tous', value: 'all' },
            { label: 'Payés', value: 'paid' },
            { label: 'En attente', value: 'pending' },
            { label: 'En retard', value: 'late' },
          ]}
        />

        <DateInput
          placeholder="Filtrer par mois"
          value={month}
          onChange={onMonthChange}
          clearable
          valueFormat="MM/YYYY"
          type="month"
          style={{ width: 150 }}
        />
      </Group>
    </Paper>
  );
} 