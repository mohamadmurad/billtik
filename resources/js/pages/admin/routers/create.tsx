import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Form from './form';

export default function Create() {
    const resource: string = 'admin.routers';
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('dashboard'),
        },
        {
            title: t(`attributes.${resource}.title`),
            href: route(resource + '.index'),
        },
        {
            title: t(`attributes.create`),
            href: '#',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(`attributes.${resource}.create_head`)} />
            <div className="px-4 py-6">
                <Form resource={resource} />
            </div>
        </AppLayout>
    );
}
