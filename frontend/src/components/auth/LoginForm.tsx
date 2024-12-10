import { TextInput, PasswordInput, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from 'react-query';
import { login } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should be at least 6 characters' : null),
    },
  });

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      notifications.show({
        title: 'Success',
        message: 'Successfully logged in',
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

  const handleSubmit = form.onSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit}>
        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          required
          mt="md"
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={mutation.isLoading}>
            Login
          </Button>
        </Group>
      </form>
    </Box>
  );
}