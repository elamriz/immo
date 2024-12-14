import { Container, Paper, Title, Text, Stack } from '@mantine/core';
import { LoginForm } from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';

export function Login() {
  return (
    <Container size="sm" mt="xl">
      <Paper p="xl" withBorder>
        <Stack gap="md">
          <Title ta="center">Connexion</Title>
          <LoginForm />
          <Text ta="center" size="sm">
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              S'inscrire
            </Link>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
