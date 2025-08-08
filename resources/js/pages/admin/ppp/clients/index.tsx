import EditAction from '@/components/actions/EditAction';
import ShowAction from '@/components/actions/ShowAction';
import DeletePopover from '@/components/murad/DeletePopover';
import MDatatable from '@/components/murad/m-datatable';
import MSelect from '@/components/murad/MSelect';
import { useDatatableFilters } from '@/hooks/useDatatableFilters';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { RoleInterface } from '@/types/models';
import { Pagination } from '@/types/pagination';
import { Head, usePage } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';

export default function Index() {
    const { items } = usePage<SharedData<{ items: Pagination }>>().props;
    const resource: string = 'company.ppp.clients';
    const { filters, setFilters, applyFilters, resetFilters, isFiltersActive } = useDatatableFilters(
        {
            search: '',
            router_id: '',
        },
        resource,
    );
    const filterComponents = (
        <div className="min-w-[300px] space-y-4">
            <div className="grid gap-2">
                <MSelect
                    label={t('attributes.router')}
                    value={String(filters.router_id)}
                    apiUrl={route('company.routers.search')}
                    id="router"
                    onChange={(e) => setFilters({ ...filters, router_id: String(e) })}

                />
            </div>

        </div>
    );

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
            <div className="px-4 py-6">
                <MDatatable
                    items={items}
                    resource={resource}
                    columns={[
                        {
                            accessorKey: 'router.name',
                            header: t('attributes.router'),
                        },
                        {
                            accessorKey: 'name',
                            header: t('attributes.name'),
                        },
                        {
                            accessorKey: 'mikrotik_username',
                            header: t('attributes.username'),
                        },
                        {
                            accessorKey: 'email',
                            header: t('attributes.email'),
                        },
                        {
                            accessorKey: 'phone',
                            header: t('attributes.phone'),
                        },
                        {
                            accessorKey: 'created_at',
                            header: t('attributes.created_at'),
                        },
                        {
                            id: 'actions',
                            header: t('attributes.actions'),
                            cell: ({ row }: { row: Row<never> }) => {
                                const rowModel = row.original as unknown as RoleInterface;
                                return (
                                    <div className="flex">
                                        {rowModel.abilities.view && <ShowAction resource={resource} rowModel={rowModel} />}
                                        {rowModel.abilities.edit && <EditAction rowModel={rowModel} resource={resource} />}
                                        {rowModel.abilities.delete && <DeletePopover id={rowModel.id} resource={resource} />}
                                    </div>
                                );
                            },
                        },
                    ]}
                    filterComponents={filterComponents}
                    filtersActive={isFiltersActive}
                    onFilterApply={applyFilters}
                    onFilterReset={resetFilters}
                />
            </div>
        </AppLayout>
    );
}
