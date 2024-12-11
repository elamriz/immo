import { Modal, TextInput, NumberInput, Button, Group, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Tenant } from '../../types/tenant';
import { updateTenant } from '../../api/tenant';

interface EditTenantModalProps {
  tenant: Tenant;
  opened: boolean;
  onClose: () => void;
  onUpdate: (tenant: Tenant) => void;
}

export function EditTenantModal({ tenant, opened, onClose, onUpdate }: EditTenantModalProps) {
  const form = useForm<Tenant>({
    initialValues: {
      ...tenant,
      leaseStartDate: new Date(tenant.leaseStartDate),
      leaseEndDate: new Date(tenant.leaseEndDate),
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

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const updatedTenant = await updateTenant({
        ...values,
        _id: tenant._id,
      });
      onUpdate(updatedTenant);
      onClose();
    } catch (error) {
      console.error('Error updating tenant:', error);
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Tenant"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Group grow>
          <TextInput
            required
            label="First Name"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            required
            label="Last Name"
            {...form.getInputProps('lastName')}
          />
        </Group>

        <Group grow mt="md">
          <TextInput
            required
            label="Email"
            {...form.getInputProps('email')}
          />
          <TextInput
            required
            label="Phone"
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

        <Group grow mt="md">
          <Select
            label="Status"
            data={[
              { value: 'pending', label: 'Pending' },
              { value: 'active', label: 'Active' },
              { value: 'ended', label: 'Ended' },
            ]}
            {...form.getInputProps('status')}
          />
          <Select
            label="Rent Status"
            data={[
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
              { value: 'late', label: 'Late' },
            ]}
            {...form.getInputProps('rentStatus')}
          />
        </Group>

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </Group>
      </form>
    </Modal>
  );
} 