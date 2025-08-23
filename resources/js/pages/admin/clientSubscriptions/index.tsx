import MDatatable from '@/components/murad/m-datatable';
import MSelect from '@/components/murad/MSelect';
import { useDatatableFilters } from '@/hooks/useDatatableFilters';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ClientSubscriptionInterface } from '@/types/models';
import { Pagination } from '@/types/pagination';
import { Head, usePage } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';

export default function Index() {
    const { items } = usePage<SharedData<{ items: Pagination }>>().props;
    const resource: string = 'company.clientSubscriptions';
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
        },
        resource,
    );
    const typedFilters = filters as { search: string; router_id: string };

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
                    value={String(typedFilters.router_id)}
                    apiUrl={route('company.clients.search')}
                    inputProps={{ id: 'router' }}
                    onChange={(e) => setFilters({ ...filters, router_id: String(e) })}
                />
            </div>
        </div>
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(`attributes.${resource}.title`)} />
            <div className="px-4 py-6">
                <MDatatable
                    items={items}
                    createButton={false}
                    resource={resource}
                    filterComponents={filterComponents}
                    columns={[
                        {
                            accessorKey: 'client.name',
                            header: t('attributes.name'),
                            cell: ({ row }: { row: Row<never> }) => {
                                const rowModel = row.original as unknown as ClientSubscriptionInterface;
                                return (
                                    <>
                                        <p>{rowModel.client?.name}</p>
                                        <p className="">{rowModel.client?.mikrotik_username}</p>
                                    </>
                                );
                            },
                        },
                        {
                            accessorKey: 'profile?.name',
                            header: t('attributes.profile'),
                        },
                        {
                            accessorKey: 'start_date',
                            header: t('attributes.start_date'),
                        },
                        {
                            accessorKey: 'end_date',
                            header: t('attributes.end_date'),
                        },
                        {
                            accessorKey: 'status',
                            header: t('attributes.status'),
                        },
                    ]}
                />
            </div>
        </AppLayout>
    );
}
