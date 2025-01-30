import { TextInput, PasswordInput, Button, Group, Box, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from 'react-query';
import { register } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { RegisterCredentials } from '../../types/auth';

export function RegisterForm() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const form = useForm<RegisterCredentials>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'owner' as const,
      phone: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should be at least 6 characters' : null),
      firstName: (value) => (value.length < 2 ? 'First name is required' : null),
      lastName: (value) => (value.length < 2 ? 'Last name is required' : null),
      role: (value) => (!value ? 'Please select your role' : null),
      phone: (value) => (!value ? 'Phone number is required' : null),
    },
  });

  const mutation = useMutation(register, {
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      notifications.show({
        title: 'Success',
        message: 'Account created successfully',
        color: 'green',
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'An error occurred',
        color: 'red',
      });
    },
  });

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <TextInput
          required
          label="First Name"
          placeholder="John"
          {...form.getInputProps('firstName')}
        />
        <TextInput
          required
          mt="md"
          label="Last Name"
          placeholder="Doe"
          {...form.getInputProps('lastName')}
        />
        <TextInput
          required
          mt="md"
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <TextInput
          required
          mt="md"
          label="Phone"
          placeholder="Your phone number"
          {...form.getInputProps('phone')}
        />
        <PasswordInput
          required
          mt="md"
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
        />
        <Select
          required
          mt="md"
          label="I am a"
          placeholder="Select your role"
          data={[
            { value: 'owner', label: 'Property Owner' },
            { value: 'tenant', label: 'Tenant' },
            { value: 'contractor', label: 'Contractor' },
          ]}
          {...form.getInputProps('role')}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={mutation.isLoading}>
            Register
          </Button>
        </Group>
      </form>
    </Box>
  );
} 