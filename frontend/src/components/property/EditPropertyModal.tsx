import { Modal, TextInput, NumberInput, Select, Textarea, Button, Group, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Property } from '../../types/property';
import { updateProperty } from '../../api/property';

interface EditPropertyModalProps {
  property: Property;
  opened: boolean;
  onClose: () => void;
  onUpdate: (property: Property) => void;
}

export function EditPropertyModal({ property, opened, onClose, onUpdate }: EditPropertyModalProps) {
  const form = useForm<Property>({
    initialValues: property,
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      address: (value) => (!value ? 'Address is required' : null),
      size: (value) => (value <= 0 ? 'Size must be greater than 0' : null),
      rentAmount: (value) => (value <= 0 ? 'Rent amount must be greater than 0' : null),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const updatedProperty = await updateProperty(property.id, values);
      notifications.show({
        title: 'Success',
        message: 'Property updated successfully',
        color: 'green',
      });
      onUpdate(updatedProperty);
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update property',
        color: 'red',
      });
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Property"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          required
          label="Property Name"
          {...form.getInputProps('name')}
        />
        <TextInput
          required
          mt="md"
          label="Address"
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
        <Select
          mt="md"
          label="Status"
          data={[
            { value: 'available', label: 'Available' },
            { value: 'occupied', label: 'Occupied' },
            { value: 'maintenance', label: 'Under Maintenance' },
          ]}
          {...form.getInputProps('status')}
        />
        <MultiSelect
          mt="md"
          label="Amenities"
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
          {...form.getInputProps('description')}
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </Group>
      </form>
    </Modal>
  );
} 