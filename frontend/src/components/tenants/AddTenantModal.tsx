import { useForm } from '@mantine/form';
import { useTenants } from '../../hooks/useTenants';

export function AddTenantModal({ propertyId, onClose }: { propertyId: string; onClose: () => void }) {
  const { addTenant } = useTenants(propertyId);

  const form = useForm({
    initialValues: {
      // ... vos champs de formulaire
    },
    validate: {
      // ... vos validations
    }
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await addTenant({
        ...values,
        propertyId
      });
      
      // Fermer le modal et réinitialiser le formulaire
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating tenant:', error);
    }
  });

  return (
    <Modal opened={true} onClose={onClose} title="Ajouter un locataire">
      <form onSubmit={handleSubmit}>
        {/* ... vos champs de formulaire ... */}
      </form>
    </Modal>
  );
} 