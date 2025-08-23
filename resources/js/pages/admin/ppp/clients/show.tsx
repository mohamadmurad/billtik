import ShowClient from '@/components/admin/clients/ShowClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ClientInterface } from '@/types/models';
import { Head, usePage } from '@inertiajs/react';

export default function Show() {
    const resource: string = 'company.ppp.clients';
    const { model } = usePage<SharedData<{ model: ClientInterface }>>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('company.dashboard'),
        },
        {
            title: t(`attributes.${resource}.title`),
            href: route(resource + '.index'),
        },
        {
            title: model.name ?? '',
            href: '#',
        },
    ];

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={model.name ?? ''} />
                <ShowClient client={model} resource={resource} />
            </AppLayout>
        </TooltipProvider>
    );
}
