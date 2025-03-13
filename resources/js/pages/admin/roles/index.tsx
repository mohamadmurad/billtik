import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pagination } from '@/types/pagination';
import { t } from '@/hooks/useTranslation';
import MDatatable from '@/components/murad/m-datatable';
import { Row } from '@tanstack/react-table';
import { RoleInterface } from '@/types/models';
import { Button } from '@/components/ui/button';
import { EyeIcon, PenIcon } from 'lucide-react';
import DeletePopover from '@/components/murad/DeletePopover';


export default function index() {
    const { items } = usePage<SharedData<{ items: Pagination }>>().props;
    const resource: string = 'roles';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('dashboard')
        },
        {
            title: t(`attributes.${resource}.title`),
            href: route('roles.index')
        }
    ];


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(`attributes.${resource}.title`)} />
            <div className="px-4 py-6">
                <MDatatable items={items} resource={resource} columns={[
                    {
                        accessorKey: 'name',
                        header: t('attributes.name')
                    },
                    {
                        accessorKey: 'created_at',
                        header: t('attributes.created_at')
                    },
                    {
                        id: 'actions',
                        header: t('attributes.actions'),
                        cell: ({ row }: { row: Row<any> }) => {
                            const rowModel = row.original as unknown as RoleInterface;

                            return (
                                <div className="flex ">
                                    <Link className="m-0" href={route(resource + '.show', rowModel.id)}>
                                        <Button variant="ghost">
                                            <EyeIcon size={'20'} />
                                        </Button>
                                    </Link>
                                    <Link className="m-0" href={route(resource + '.edit', rowModel.id)}>
                                        <Button variant="ghost">
                                            <PenIcon size={'20'} />
                                        </Button>
                                    </Link>
                                    <DeletePopover id={rowModel.id} resource={resource} />

                                </div>
                            );
                        }
                    }
                ]} />
            </div>
        </AppLayout>
    );
}
