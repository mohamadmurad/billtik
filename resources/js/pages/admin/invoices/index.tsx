import MDatatable from '@/components/murad/m-datatable';
import MSelect from '@/components/murad/MSelect';
import { useDatatableFilters } from '@/hooks/useDatatableFilters';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Pagination } from '@/types/pagination';
import { Head, usePage } from '@inertiajs/react';

export default function Index() {
    const { items } = usePage<SharedData<{ items: Pagination }>>().props;
    const resource: string = 'company.invoices';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('company.dashboard'),
        },
        {
            title: t(`attributes.company.invoices.title`),
            href: route(resource + '.index'),
        },
    ];

    const { filters, setFilters, applyFilters, resetFilters, isFiltersActive } = useDatatableFilters(
        {
            search: '',
            router_id: '',
            client_type: 'ppp',
            client_id: '',
            status: '',
        },
        resource,
    );
    const typed = filters as { search: string; router_id: string; client_type: 'ppp' | 'hotspot'; client_id: string; status: string };

    const filterComponents = (
        <div className="min-w-[300px] space-y-4">
            <div className="grid gap-2">
                <MSelect
                    label={t('attributes.router')}
                    value={String(typed.router_id)}
                    apiUrl={route('company.routers.search')}
                    inputProps={{ id: 'router' }}
                    onChange={(e) => setFilters({ ...filters, router_id: String(e), client_id: '' })}
                />
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">Connection Type</label>
                <select
                    className="border-input bg-background text-foreground h-10 rounded-md border px-3 py-2 text-sm"
                    value={typed.client_type}
                    onChange={(e) => setFilters({ ...filters, client_type: e.target.value as 'ppp' | 'hotspot', client_id: '' })}
                >
                    <option value="ppp">PPP</option>
                    <option value="hotspot">Hotspot</option>
                </select>
            </div>
            <div className="grid gap-2">
                <MSelect
                    label={t('attributes.client')}
                    value={String(typed.client_id)}
                    apiUrl={typed.client_type === 'ppp' ? route('company.ppp.clients.search') : route('company.hotspot.clients.search')}
                    inputProps={{ id: 'client' }}
                    dependencies={{ router_id: typed.router_id }}
                    onChange={(e) => setFilters({ ...filters, client_id: String(e) })}
                />
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(`attributes.company.invoices.title`)} />
            <div className="px-4 py-6">
                <MDatatable
                    resource={resource}
                    items={items}
                    filterComponents={filterComponents}
                    filtersActive={isFiltersActive}
                    onFilterApply={applyFilters}
                    onFilterReset={resetFilters}
                    columns={[
                        {
                            accessorKey: 'formated_number',
                            header: t('attributes.name'),
                        },
                        {
                            accessorKey: 'client.name',
                            header: t('attributes.client'),
                        },
                        {
                            accessorKey: 'issue_date',
                            header: 'Issue Date',
                        },
                        {
                            accessorKey: 'due_date',
                            header: 'Due Date',
                        },
                        {
                            accessorKey: 'total_amount',
                            header: 'Total',
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
