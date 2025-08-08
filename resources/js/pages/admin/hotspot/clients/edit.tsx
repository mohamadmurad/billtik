import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Form from './form';
import { t } from '@/hooks/useTranslation';
export default function Edit() {

    const resource: string = 'company.hotspot.clients';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('company.dashboard')
        }, {
            title: t(`attributes.${resource}.title`),
            href: route(resource+'.index')
        }, {
            title: t(`attributes.update`),
            href: '#'
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(`attributes.${resource}.edit_head`)} />
            <div className="px-4 py-6">
                <Form resource={resource} />
            </div>
        </AppLayout>
    );
}
