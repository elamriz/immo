import { Modal, TextInput, NumberInput, Button, Group, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { CreateTenantDto } from '../../types/tenant';

interface AddTenantModalProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (tenant: CreateTenantDto) => void;
  propertyId: string;
}

export function AddTenantModal({ opened, onClose, onAdd, propertyId }: AddTenantModalProps) {
  const form = useForm<CreateTenantDto>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      propertyId: propertyId,
      leaseStartDate: new Date(),
      leaseEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rentAmount: 0,
      depositAmount: 0,
      status: 'pending',
      rentStatus: 'pending',
      documents: [],
    },
    validate: {
      firstName: (value) => (!value ? 'First name is required' : null),
      lastName: (value) => (!value ? 'Last name is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (!value ? 'Phone number is required' : null),
      rentAmount: (value) => (value <= 0 ? 'Rent amount must be greater than 0' : null),
      depositAmount: (value) => (value <= 0 ? 'Deposit amount must be greater than 0' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onAdd(values);
    form.reset();
    onClose();
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add New Tenant"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Group grow>
          <TextInput
            required
            label="First Name"
            placeholder="John"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            required
            label="Last Name"
            placeholder="Doe"
            {...form.getInputProps('lastName')}
          />
        </Group>

        <Group grow mt="md">
          <TextInput
            required
            label="Email"
            placeholder="john@example.com"
            {...form.getInputProps('email')}
          />
          <TextInput
            required
            label="Phone"
            placeholder="+1234567890"
            {...form.getInputProps('phone')}
          />
        </Group>

        <Group grow mt="md">
          <DateInput
            required
            label="Lease Start Date"
            {...form.getInputProps('leaseStartDate')}
          />
          <DateInput
            required
            label="Lease End Date"
            minDate={new Date(form.values.leaseStartDate)}
            {...form.getInputProps('leaseEndDate')}
          />
        </Group>

        <Group grow mt="md">
          <NumberInput
            required
            label="Monthly Rent"
            min={0}
            {...form.getInputProps('rentAmount')}
          />
          <NumberInput
            required
            label="Security Deposit"
            min={0}
            {...form.getInputProps('depositAmount')}
          />
        </Group>

        <Select
          mt="md"
          label="Status"
          data={[
            { value: 'pending', label: 'Pending' },
            { value: 'active', label: 'Active' },
            { value: 'ended', label: 'Ended' },
          ]}
          {...form.getInputProps('status')}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Tenant</Button>
        </Group>
      </form>
    </Modal>
  );
} 