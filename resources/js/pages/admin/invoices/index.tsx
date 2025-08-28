import MDatatable from '@/components/murad/m-datatable';
import MSelect from '@/components/murad/MSelect';
import { useDatatableFilters } from '@/hooks/useDatatableFilters';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { InvoiceInterface } from '@/types/models';
import { Pagination } from '@/types/pagination';
import { Head, usePage } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';
import { AlertCircle, CheckCircle, Filter, Plus, Receipt, Router, User, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getStatusBadge = (status: string) => {
    const statusConfig = {
        paid: {
            icon: CheckCircle,
            className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            label: 'Paid',
        },
        unpaid: {
            icon: AlertCircle,
            className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            label: 'Unpaid',
        },
        overdue: {
            icon: XCircle,
            className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            label: 'Overdue',
        },
        cancelled: {
            icon: XCircle,
            className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            label: 'Cancelled',
        },
    };

    const config = statusConfig[status?.toLowerCase() as keyof typeof statusConfig] || statusConfig.unpaid;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
};

const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(Number(amount));
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

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
        <div className="min-w-[320px] space-y-6 p-1">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <Router className="h-4 w-4" />
                    {t('attributes.router')}
                </label>
                <MSelect
                    value={String(typed.router_id)}
                    apiUrl={route('company.routers.search')}
                    inputProps={{ id: 'router', className: 'h-11' }}
                    onChange={(e) => setFilters({ ...filters, router_id: String(e), client_id: '' })}
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <Filter className="h-4 w-4" />
                    Connection Type
                </label>
                <select
                    className="bg-background border-input focus:ring-ring h-11 w-full rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    value={typed.client_type}
                    onChange={(e) => setFilters({ ...filters, client_type: e.target.value as 'ppp' | 'hotspot', client_id: '' })}
                >
                    <option value="ppp">PPP Connection</option>
                    <option value="hotspot">Hotspot Connection</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    {t('attributes.client')}
                </label>
                <MSelect
                    value={String(typed.client_id)}
                    apiUrl={typed.client_type === 'ppp' ? route('company.ppp.clients.search') : route('company.hotspot.clients.search')}
                    inputProps={{ id: 'client', className: 'h-11' }}
                    dependencies={{ router_id: typed.router_id }}
                    onChange={(e) => setFilters({ ...filters, client_id: String(e) })}
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Invoice Status
                </label>
                <select
                    className="bg-background border-input focus:ring-ring h-11 w-full rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    value={typed.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(`attributes.company.invoices.title`)} />
            <div className="px-4 py-6">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                            <Receipt className="text-primary h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-foreground text-2xl font-bold">Invoices</h1>
                            <p className="text-muted-foreground">Manage and track all your invoices</p>
                        </div>
                    </div>
                    <Button asChild className="gap-2">
                        <a href={route(resource + '.create')}>
                            <Plus className="h-4 w-4" />
                            Create Invoice
                        </a>
                    </Button>
                </div>

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
                            header: 'Invoice Number',
                            cell: ({ row }: { row: Row<never> }) => {
                                const inv = row.original as unknown as InvoiceInterface;
                                return <div className="text-foreground font-medium">{inv.formated_number}</div>;
                            },
                        },
                        {
                            accessorKey: 'client.name',
                            header: t('attributes.client'),
                            cell: ({ row }: { row: Row<never> }) => {
                                const inv = row.original as unknown as InvoiceInterface & { client?: { name: string } };
                                return <div className="text-foreground font-medium">{inv.client?.name || 'Unknown Client'}</div>;
                            },
                        },
                        {
                            id: 'profile',
                            header: t('attributes.profile'),
                            cell: ({ row }: { row: Row<never> }) => {
                                const inv = row.original as unknown as InvoiceInterface & { items?: any[] };
                                const subItem = inv.items?.find((i) => i.item_type?.toLowerCase().includes('clientsubscription'));
                                const profileName = subItem?.item?.profile?.name;
                                return (
                                    <div className="text-sm">
                                        {profileName ? (
                                            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {profileName}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </div>
                                );
                            },
                        },
                        {
                            accessorKey: 'issue_date',
                            header: 'Issue Date',
                            cell: ({ row }: { row: Row<never> }) => {
                                const inv = row.original as unknown as InvoiceInterface;
                                return <div className="text-foreground text-sm font-medium">{formatDate(inv.issue_date)}</div>;
                            },
                        },
                        {
                            accessorKey: 'due_date',
                            header: 'Due Date',
                            cell: ({ row }: { row: Row<never> }) => {
                                const inv = row.original as unknown as InvoiceInterface;
                                const isOverdue = new Date(inv.due_date) < new Date() && inv.status?.toLowerCase() !== 'paid';
                                return (
                                    <div className={`text-sm font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                                        {formatDate(inv.due_date)}
                                        {isOverdue && <div className="mt-1 text-xs text-red-500">Overdue</div>}
                                    </div>
                                );
                            },
                        },
                        {
                            accessorKey: 'total_amount',
                            header: 'Total',
                            cell: ({ row }: { row: Row<never> }) => {
                                const inv = row.original as unknown as InvoiceInterface;
                                return (
                                    <div className="text-right">
                                        <div className="text-foreground text-lg font-bold tabular-nums">{formatCurrency(inv.total_amount)}</div>
                                    </div>
                                );
                            },
                        },
                        {
                            accessorKey: 'status',
                            header: t('attributes.status'),
                            cell: ({ row }: { row: Row<never> }) => {
                                const inv = row.original as unknown as InvoiceInterface;
                                return getStatusBadge(inv.status);
                            },
                        },
                    ]}
                />
            </div>
        </AppLayout>
    );
}
