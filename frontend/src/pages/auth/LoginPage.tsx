import { Container, Paper, Title, Text, Anchor } from '@mantine/core';
import { LoginForm } from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <Container size={420} my={40}>
      <Title ta="center" mb={30}>
        Welcome back!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoginForm />
        <Text c="dimmed" size="sm" ta="center" mt="xl">
          Don't have an account?{' '}
          <Anchor component={Link} to="/register" size="sm">
            Register here
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
} 