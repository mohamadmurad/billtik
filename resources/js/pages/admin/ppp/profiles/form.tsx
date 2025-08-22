import ProfileForm from '@/components/admin/profiles/ProfileForm';

export default function Form({ resource, defaultConnectionType = 'ppp' }: { resource: string; defaultConnectionType: 'ppp' | 'hotspot' }) {
    return <ProfileForm resource={resource} defaultConnectionType={defaultConnectionType} />;
}
