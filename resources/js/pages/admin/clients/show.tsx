import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ClientInterface } from '@/types/models';
import { Head, usePage } from '@inertiajs/react';

export default function Show() {
    const resource: string = 'clients';
    const { model } = usePage<SharedData<{ model: ClientInterface }>>().props;
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
            title: model.name,
            href: '#',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={model.name} />
            <div className="px-4 py-6">
                <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 dark:bg-zinc-900">
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.router')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.router.name}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.name')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.name}</p>
                    </div>

                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.mikrotik_username')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.mikrotik_username}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.mikrotik_password')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.mikrotik_password}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.email')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.email}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.phone')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.phone}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.id_number')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.id_number}</p>
                    </div>

                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.created_at')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.created_at}</p>
                    </div>
                </div>


                <div className="mt-3 grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 dark:bg-zinc-900">

                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.profile')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.active_subscription.profile.local_name}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.start_date')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.active_subscription.start_date}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.start_date')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.active_subscription.end_date}</p>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
