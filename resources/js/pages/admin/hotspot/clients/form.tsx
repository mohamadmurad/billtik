import ClientForm from '@/components/admin/clients/ClientForm';

export default function Form({ resource }: { resource: string }) {
  return <ClientForm resource={resource} />;
}
