import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { t } from '@/hooks/useTranslation';
import ProfilesIndexContent from '@/components/admin/profiles/ProfilesIndexContent';

export default function Index() {
    const resource: string = 'company.hotspot.profiles';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('company.dashboard'),
        },
        {
            title: t(`attributes.${resource}.title`),
            href: route(resource + '.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(`attributes.${resource}.title`)} />
            <ProfilesIndexContent resource={resource} />
        </AppLayout>
    );
}
