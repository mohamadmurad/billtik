import ShowProfile from '@/components/admin/profiles/ShowProfile';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ProfileInterface } from '@/types/models';
import { Head, usePage } from '@inertiajs/react';

export default function Show() {
    const resource: string = 'company.ppp.profiles';
    const { model } = usePage<SharedData<{ model: ProfileInterface }>>().props;

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
            title: model.name || model.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={model.name} />
            <ShowProfile profile={model} resource={resource} />
        </AppLayout>
    );
}
