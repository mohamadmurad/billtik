import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { CompanyInterface, ProfileInterface } from '@/types/models';
import { Head, usePage } from '@inertiajs/react';

export default function Create() {
    const resource: string = 'company.hotspot.profiles';
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
            title: model.local_name,
            href: '#',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={model.local_name} />
            <div className="px-4 py-6">
                <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 dark:bg-zinc-900">
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.router')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.router.name}</p>
                    </div> <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.name')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.name}</p>
                    </div>

                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.status')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.status}</p>
                    </div>

                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.created_at')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.created_at}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
