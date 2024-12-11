import { Modal, Text, Group, Stack, Badge, Card, Grid } from '@mantine/core';
import { Tenant } from '../../types/tenant';
import { format } from 'date-fns';

interface TenantDetailsModalProps {
  tenant: Tenant;
  opened: boolean;
  onClose: () => void;
}

export function TenantDetailsModal({ tenant, opened, onClose }: TenantDetailsModalProps) {
  const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Stack spacing={4}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text>{value}</Text>
    </Stack>
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Tenant Details"
      size="lg"
    >
      <Card withBorder>
        <Stack>
          <Group position="apart">
            <Text size="xl" fw={700}>
              {tenant.firstName} {tenant.lastName}
            </Text>
            <Badge
              color={
                tenant.status === 'active'
                  ? 'green'
                  : tenant.status === 'pending'
                  ? 'yellow'
                  : 'red'
              }
              size="lg"
            >
              {tenant.status}
            </Badge>
          </Group>

          <Grid>
            <Grid.Col span={6}>
              <InfoItem label="Email" value={tenant.email} />
            </Grid.Col>
            <Grid.Col span={6}>
              <InfoItem label="Phone" value={tenant.phone} />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <InfoItem
                label="Lease Start Date"
                value={format(new Date(tenant.leaseStartDate), 'dd/MM/yyyy')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <InfoItem
                label="Lease End Date"
                value={format(new Date(tenant.leaseEndDate), 'dd/MM/yyyy')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <InfoItem
                label="Monthly Rent"
                value={`€${tenant.rentAmount.toLocaleString()}`}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <InfoItem
                label="Security Deposit"
                value={`€${tenant.depositAmount.toLocaleString()}`}
              />
            </Grid.Col>
          </Grid>

          <Group position="apart">
            <Text fw={500}>Rent Status</Text>
            <Badge
              color={
                tenant.rentStatus === 'paid'
                  ? 'green'
                  : tenant.rentStatus === 'pending'
                  ? 'yellow'
                  : 'red'
              }
            >
              {tenant.rentStatus}
            </Badge>
          </Group>

          {tenant.documents && tenant.documents.length > 0 && (
            <Stack>
              <Text fw={500}>Documents</Text>
              <Group>
                {tenant.documents.map((doc, index) => (
                  <Badge key={index} variant="outline">
                    {doc}
                  </Badge>
                ))}
              </Group>
            </Stack>
          )}
        </Stack>
      </Card>
    </Modal>
  );
} 