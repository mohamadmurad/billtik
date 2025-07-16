import EditActionInModal from '@/components/actions/EditActionInModal';
import ShowAction from '@/components/actions/showAction';
import DeletePopover from '@/components/murad/DeletePopover';
import MDatatable from '@/components/murad/m-datatable';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { RoleInterface } from '@/types/models';
import { Pagination } from '@/types/pagination';
import { Head, usePage } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';

export default function Index() {
    const { items } = usePage<SharedData<{ items: Pagination }>>().props;
    const resource: string = 'companies';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('dashboard'),
        },
        {
            title: t(`attributes.${resource}.title`),
            href: route('roles.index'),
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
                            accessorKey: 'owner.name',
                            header: t('attributes.owner'),
                            cell: ({ row }: { row: Row<any> }) => {
                                const rowModel = row.original as unknown as RoleInterface;
                                return (
                                    <>
                                        <span className="text-muted-foreground block">{rowModel.owner.name}</span>
                                        <span className="text-muted-foreground block">{rowModel.owner.email}</span>
                                    </>
                                );
                            },
                        },
                        {
                            accessorKey: 'status',
                            header: t('attributes.status'),
                        },
                        {
                            accessorKey: 'created_at',
                            header: t('attributes.created_at'),
                        },
                        {
                            id: 'actions',
                            header: t('attributes.actions'),
                            cell: ({ row }: { row: Row<any> }) => {
                                const rowModel = row.original as unknown as RoleInterface;
                                return (
                                    <div className="flex">
                                        {rowModel.abilities.view && <ShowAction resource={resource} rowModel={rowModel} />}
                                        {rowModel.abilities.edit && (
                                            <EditActionInModal
                                                onClick={() => {
                                                    // setCurrentModel(rowModel);
                                                    // setModalOpen(true);
                                                }}
                                            />
                                        )}
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
