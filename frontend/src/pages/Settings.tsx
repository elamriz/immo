import React from 'react';
import { Container, Title, Paper, Stack, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '../store/authStore';

interface SettingsForm {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function Settings() {
  const user = useAuthStore((state) => state.user);

  const form = useForm<SettingsForm>({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      newPassword: (value) => 
        value && value.length < 6 ? 'Le mot de passe doit contenir au moins 6 caractères' : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Les mots de passe ne correspondent pas' : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    // TODO: Implémenter la mise à jour du profil
    notifications.show({
      title: 'Succès',
      message: 'Profil mis à jour avec succès',
      color: 'green',
    });
  });

  return (
    <Container size="xl">
      <Title mb="xl">Paramètres</Title>

      <Paper p="xl" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Prénom"
                placeholder="Votre prénom"
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Nom"
                placeholder="Votre nom"
                {...form.getInputProps('lastName')}
              />
            </Group>

            <TextInput
              label="Email"
              placeholder="votre@email.com"
              {...form.getInputProps('email')}
            />

            <Title order={3} mt="xl">Changer le mot de passe</Title>

            <TextInput
              type="password"
              label="Mot de passe actuel"
              {...form.getInputProps('currentPassword')}
            />

            <Group grow>
              <TextInput
                type="password"
                label="Nouveau mot de passe"
                {...form.getInputProps('newPassword')}
              />
              <TextInput
                type="password"
                label="Confirmer le mot de passe"
                {...form.getInputProps('confirmPassword')}
              />
            </Group>

            <Group justify="flex-end" mt="xl">
              <Button type="submit">
                Enregistrer les modifications
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 