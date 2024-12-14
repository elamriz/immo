import { Container, Paper, Title, Text, Stack } from '@mantine/core';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

export function Register() {
  return (
    <Container size="sm" mt="xl">
      <Paper p="xl" withBorder>
        <Stack gap="md">
          <Title ta="center">Inscription</Title>
          <RegisterForm />
          <Text ta="center" size="sm">
            Déjà un compte ?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Se connecter
            </Link>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
} 