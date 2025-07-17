import EditAction from '@/components/actions/EditAction';
import ShowAction from '@/components/actions/ShowAction';
import DeletePopover from '@/components/murad/DeletePopover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, User } from '@/types';
import { CompanyInterface } from '@/types/models';
import { Head, usePage } from '@inertiajs/react';

export default function Create() {
    const resource: string = 'companies';
    const { model } = usePage<SharedData<{ model: CompanyInterface }>>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('dashboard'),
        },
        {
            title: t(`attributes.${resource}.title`),
            href: route(resource + '.index'),
        },
        {
            title: model.local_name,
            href: '#',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={model.local_name} />
            <div className="px-4 py-6">
                <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 dark:bg-zinc-900">
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.name_ar')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.name.ar}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.name_en')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.name.en}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.status')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.is_active}</p>
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.created_at')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.created_at}</p>
                    </div>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 dark:bg-zinc-900">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('attributes.name')}</TableHead>
                                <TableCell>{t('attributes.email')}</TableCell>
                                <TableCell>{t('attributes.actions')}</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {model.users.map((user: User) => (
                                <TableRow>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex">
                                            {user.abilities.view && <ShowAction resource={'users'} rowModel={user} />}
                                            {user.abilities.edit && <EditAction resource={'users'} rowModel={user} />}
                                            {user.abilities.delete && <DeletePopover id={user.id} resource={'users'} />}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
