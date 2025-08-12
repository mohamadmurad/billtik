import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { t } from '@/hooks/useTranslation';
import ClientsIndexContent from '@/components/admin/clients/ClientsIndexContent';

export default function Index() {
    const resource: string = 'company.hotspot.clients';

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
            <ClientsIndexContent resource={resource} />
        </AppLayout>
    );
}
