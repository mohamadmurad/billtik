import SubscriptionsTable from '@/components/admin/subscriptions/SubscriptionsTable';
import MSelect from '@/components/murad/MSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ClientInterface } from '@/types/models';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function Show() {
    const resource: string = 'company.ppp.clients';
    const { model } = usePage<SharedData<{ model: ClientInterface & { subscriptions?: any[] } }>>().props;
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
            title: model.name,
            href: '#',
        },
    ];

    const { data, setData, post, processing, reset, errors } = useForm({
        profile_id: '',
        start_date: '',
        end_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(resource + '.subscriptions.store', model.id), {
            onSuccess: () => reset(),
        });
    };

    const enable = () => router.post(route('company.ppp.clients.enable', model.id));
    const disable = () => router.post(route('company.ppp.clients.disable', model.id));

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
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.active_subscription?.profile?.name ?? '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.start_date')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.active_subscription?.start_date ?? '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.end_date')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.active_subscription?.end_date ?? '-'}</p>
                    </div>
                </div>

                <div className="mt-3 flex gap-2">
                    {model.abilities?.can_enable && (
                        <Button onClick={enable} variant="default">
                            Enable
                        </Button>
                    )}
                    {model.abilities?.can_disable && (
                        <Button onClick={disable} variant="destructive">
                            Disable
                        </Button>
                    )}
                </div>
                <div className="mt-3 overflow-x-auto rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
                    <h5 className="mb-2"> Subscriptions</h5>
                    <SubscriptionsTable
                        type={'ppp'}
                        resource={resource}
                        items={{
                            data: model.subscriptions,
                            total: model.subscriptions.length,
                            links: [],
                            current_page: 1,
                            from: 1,
                            to: 1,
                        }}
                        // filterComponents={filterComponents}
                        // filtersActive={isFiltersActive}
                        // onFilterApply={applyFilters}
                        // onFilterReset={resetFilters}
                    />
                </div>

                <form className="mt-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900" onSubmit={submit}>
                    <h5 className="mb-4">{t('attributes.create')}</h5>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="grid gap-2">
                            <MSelect
                                label={t('attributes.profile')}
                                value={String(data.profile_id)}
                                apiUrl={route('company.ppp.profiles.search', { is_synced: 1 })}
                                inputProps={{ id: 'profile' }}
                                onChange={(e) => setData('profile_id', String(e))}
                                error={errors['profile_id']}
                                dependencies={{ router_id: model.router_id }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                label={t('attributes.start_date')}
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                error={errors['start_date']}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                label={t('attributes.end_date')}
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                error={errors['end_date']}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="mt-4" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {t('attributes.save')}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
