import SubscriptionsTable from '@/components/admin/subscriptions/SubscriptionsTable';
import MSelect from '@/components/murad/MSelect';
import { useDatatableFilters } from '@/hooks/useDatatableFilters';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Pagination } from '@/types/pagination';
import { Head, usePage } from '@inertiajs/react';

export default function Index() {
    const { items } = usePage<SharedData<{ items: Pagination }>>().props;
    const resource: string = 'company.ppp.subscriptions';

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
    const { filters, setFilters, applyFilters, resetFilters, isFiltersActive } = useDatatableFilters(
        {
            search: '',
            router_id: '',
            profile_id: '',
            client_id: '',
        },
        resource,
    );
    const typedFilters = filters as { search: string; router_id: string; profile_id: string; client_id: string };
    const filterComponents = (
        <div className="min-w-[300px] space-y-4">
            <div className="grid gap-2">
                <MSelect
                    label={t('attributes.router')}
                    value={String(typedFilters.router_id)}
                    apiUrl={route('company.routers.search')}
                    inputProps={{ id: 'router' }}
                    onChange={(e) => setFilters({ ...filters, router_id: String(e) })}
                />
            </div>
            <div className="grid gap-2">
                <MSelect
                    label={t('attributes.client')}
                    value={String(typedFilters.client_id)}
                    apiUrl={route('company.ppp.clients.search')}
                    inputProps={{ id: 'router' }}
                    dependencies={{ router_id: typedFilters.router_id }}
                    onChange={(e) => setFilters({ ...filters, client_id: String(e) })}
                />
            </div>
            <div className="grid gap-2">
                <MSelect
                    label={t('attributes.profile')}
                    value={String(typedFilters.profile_id)}
                    apiUrl={route('company.ppp.profiles.search')}
                    inputProps={{ id: 'router' }}
                    dependencies={{ router_id: typedFilters.router_id }}
                    onChange={(e) => setFilters({ ...filters, profile_id: String(e) })}
                />
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(`attributes.${resource}.title`)} />
            <div className="px-4 py-6">
                <SubscriptionsTable
                    type={'ppp'}
                    resource={resource}
                    items={items}
                    filterComponents={filterComponents}
                    filtersActive={isFiltersActive}
                    onFilterApply={applyFilters}
                    onFilterReset={resetFilters}
                />
            </div>
        </AppLayout>
    );
}
