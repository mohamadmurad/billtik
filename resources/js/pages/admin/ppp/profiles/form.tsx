import ProfileForm from '@/components/admin/profiles/ProfileForm';

export default function Form({ resource }: { resource: string }) {
  return <ProfileForm resource={resource} defaultConnectionType="ppp" />;
}
