import EditAction from '@/components/actions/EditAction';
import ShowAction from '@/components/actions/ShowAction';
import DeletePopover from '@/components/murad/DeletePopover';
import MDatatable from '@/components/murad/m-datatable';
import { Badge } from '@/components/ui/badge';
import { t } from '@/hooks/useTranslation';
import { ClientSubscriptionInterface } from '@/types/models';
import { Pagination } from '@/types/pagination';
import { Link } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';
import { ArrowUpRight } from 'lucide-react';
import { ReactNode } from 'react';

interface SubscriptionsTableProps {
    type: 'ppp' | 'hotspot';
    resource: string;
    items: Pagination;
    filterComponents?: ReactNode;
    filtersActive?: boolean;
    onFilterApply?: () => void;
    onFilterReset?: () => void;
}

export default function SubscriptionsTable({
    type,
    resource,
    items,
    filterComponents = null,
    filtersActive = false,
    onFilterApply,
    onFilterReset,
}: SubscriptionsTableProps) {
    const getStatusBadgeClasses = (status: string) => {
        const baseClasses = 'text-xs font-medium';

        switch (status?.toLowerCase()) {
            case 'active':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
            case 'expired':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
        }
    };

    return (
        <MDatatable
            items={items}
            createButton={false}
            resource={resource}
            columns={[
                {
                    accessorKey: 'client.name',
                    header: t('attributes.client'),
                    cell: ({ row }) => {
                        const rowModel = row.original as unknown as ClientSubscriptionInterface;
                        return (
                            <Link
                                href={route('company.' + type + '.clients.show', rowModel.client.id)}
                                className="group inline-flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {rowModel.client.name}
                                <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
                            </Link>
                        );
                    },
                },
                {
                    accessorKey: 'profile.name',
                    header: t('attributes.profile'),
                    cell: ({ row }) => {
                        const rowModel = row.original as unknown as ClientSubscriptionInterface;
                        return (
                            <Link
                                href={route('company.' + type + '.profiles.show', rowModel.profile.id)}
                                className="group inline-flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {rowModel.profile.name}
                                <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
                            </Link>
                        );
                    },
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
                    cell: ({ row }) => {
                        const rowModel = row.original as unknown as ClientSubscriptionInterface;
                        return <Badge className={getStatusBadgeClasses(rowModel.status)}>{rowModel.status.toUpperCase()}</Badge>;
                    },
                },
                {
                    id: 'actions',
                    header: t('attributes.actions'),
                    cell: ({ row }: { row: Row<never> }) => {
                        const rowModel = row.original as unknown as ClientSubscriptionInterface;
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
            filtersActive={filtersActive}
            onFilterApply={onFilterApply}
            onFilterReset={onFilterReset}
        />
    );
}
