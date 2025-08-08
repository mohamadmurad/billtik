import EditAction from '@/components/actions/EditAction';
import ShowAction from '@/components/actions/ShowAction';
import DeletePopover from '@/components/murad/DeletePopover';
import MDatatable from '@/components/murad/m-datatable';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { CompanyInterface } from '@/types/models';
import { Pagination } from '@/types/pagination';
import { Head, usePage } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';

export default function Index() {
    const { items } = usePage<SharedData<{ items: Pagination }>>().props;
    const resource: string = 'admin.companies';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('admin.dashboard'),
        },
        {
            title: t(`attributes.${resource}.title`),
            href: route('admin.companies.index'),
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
                            accessorKey: 'local_name',
                            header: t('attributes.name'),
                        },
                        {
                            accessorKey: 'is_active',
                            header: t('attributes.status'),
                            cell: ({ row }: { row: Row<any> }) => {
                                const rowModel = row.original as unknown as CompanyInterface;
                                return (
                                    <>
                                        {rowModel.is_active && (
                                            <span className="text-muted rounded bg-green-500 p-1 text-xs dark:bg-green-200">
                                                {t('attributes.active')}
                                            </span>
                                        )}
                                    </>
                                );
                            },
                        },
                        {
                            accessorKey: 'created_at',
                            header: t('attributes.created_at'),
                        },
                        {
                            id: 'actions',
                            header: t('attributes.actions'),
                            cell: ({ row }: { row: Row<any> }) => {
                                const rowModel = row.original as unknown as CompanyInterface;
                                return (
                                    <div className="flex">
                                        {rowModel.abilities.view && <ShowAction resource={resource} rowModel={rowModel} />}
                                        {rowModel.abilities.edit && <EditAction resource={resource} rowModel={rowModel} />}
                                        {rowModel.abilities.delete && <DeletePopover id={rowModel.id} resource={resource} />}
                                    </div>
                                );
                            },
                        },
                    ]}
                />
            </div>
        </AppLayout>
    );
}
