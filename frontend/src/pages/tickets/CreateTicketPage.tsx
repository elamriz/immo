import { Container, Title, Paper } from '@mantine/core';
import { CreateTicketForm } from '../../components/ticket/CreateTicketForm';
import { useNavigate, useParams } from 'react-router-dom';

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  if (!propertyId) {
    return <div>Propriété non trouvée</div>;
  }

  return (
    <Container size="md" py="xl">
      <Paper shadow="xs" p="xl">
        <Title order={2} mb="xl">Créer un nouveau ticket</Title>
        <CreateTicketForm
          propertyId={propertyId}
          onSuccess={() => navigate('/tickets')}
          onCancel={() => navigate(-1)}
        />
      </Paper>
    </Container>
  );
} 