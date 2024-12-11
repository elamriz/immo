import { Modal, TextInput, NumberInput, Select, Textarea, Button, Group, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { CreatePropertyDto } from '../../types/property';
import { createProperty } from '../../api/property';

interface AddPropertyModalProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (property: Property) => void;
}

export function AddPropertyModal({ opened, onClose, onAdd }: AddPropertyModalProps) {
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
    },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      address: (value) => (!value ? 'Address is required' : null),
      size: (value) => (value <= 0 ? 'Size must be greater than 0' : null),
      rentAmount: (value) => (value <= 0 ? 'Rent amount must be greater than 0' : null),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const newProperty = await createProperty(values);
      notifications.show({
        title: 'Success',
        message: 'Property added successfully',
        color: 'green',
      });
      onAdd(newProperty);
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Error adding property:', error);
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to add property',
        color: 'red',
      });
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add New Property"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          required
          label="Property Name"
          placeholder="e.g., Sunny Apartment"
          {...form.getInputProps('name')}
        />
        <TextInput
          required
          mt="md"
          label="Address"
          placeholder="Full address"
          {...form.getInputProps('address')}
        />
        <Group grow mt="md">
          <Select
            label="Property Type"
            data={[
              { value: 'house', label: 'House' },
              { value: 'apartment', label: 'Apartment' },
              { value: 'commercial', label: 'Commercial' },
            ]}
            {...form.getInputProps('type')}
          />
          <NumberInput
            required
            label="Size (m²)"
            min={0}
            {...form.getInputProps('size')}
          />
        </Group>
        <Group grow mt="md">
          <NumberInput
            required
            label="Number of Rooms"
            min={1}
            {...form.getInputProps('numberOfRooms')}
          />
          <NumberInput
            required
            label="Max Tenants"
            min={1}
            {...form.getInputProps('maxTenants')}
          />
        </Group>
        <NumberInput
          required
          mt="md"
          label="Monthly Rent"
          min={0}
          {...form.getInputProps('rentAmount')}
        />
        <MultiSelect
          mt="md"
          label="Amenities"
          placeholder="Select amenities"
          data={[
            { value: 'parking', label: 'Parking' },
            { value: 'furnished', label: 'Furnished' },
            { value: 'aircon', label: 'Air Conditioning' },
            { value: 'heating', label: 'Heating' },
            { value: 'garden', label: 'Garden' },
            { value: 'elevator', label: 'Elevator' },
          ]}
          {...form.getInputProps('amenities')}
        />
        <Textarea
          mt="md"
          label="Description"
          placeholder="Property description"
          {...form.getInputProps('description')}
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Property</Button>
        </Group>
      </form>
    </Modal>
  );
} 