import { Container, Paper, Title } from '@mantine/core';
import { RegisterForm } from '../../components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <Container size={420} my={40}>
      <Title ta="center" mb={30}>
        Create an account
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <RegisterForm />
      </Paper>
    </Container>
  );
} 