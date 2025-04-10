import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, User } from '@/types';
import { GroupedPermissionsInterface, RoleInterface } from '@/types/models';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Show() {
    const resource: string = 'users';
    const { model, permissions, roles } = usePage<
        SharedData<{
            permissions: GroupedPermissionsInterface;
            roles: RoleInterface[];
            model: User;
        }>
    >().props;
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
            title: model.name,
            href: '#',
        },
    ];

    const { data, setData, put, reset, errors, processing } = useForm({
        permissions: model?.permissions?.map((permission) => permission.id) || [],
        roles: model?.roles?.map((permission) => permission.id) || [],
    });

    const handelPermissionsChanged = (permissionId: number) => {
        setData(
            'permissions',
            data.permissions.includes(permissionId)
                ? data.permissions.filter((id: number) => id !== permissionId) // Remove if already selected
                : [...data.permissions, permissionId], // Add if not selected
        );
    };
    const handelRolesChanged = (roleId: number) => {
        setData(
            'roles',
            data.roles.includes(roleId)
                ? data.roles.filter((id: number) => id !== roleId) // Remove if already selected
                : [...data.permissions, roleId], // Add if not selected
        );
    };
    const handleGroupChange = (group: string, permissions: { id: number }[]) => {
        const groupIds = permissions.map((p) => p.id);
        const isSelected = groupIds.every((id) => data.permissions.includes(id));

        setData(
            'permissions',
            isSelected
                ? data.permissions.filter((id: number) => !groupIds.includes(id)) // Remove all in group
                : [...data.permissions, ...groupIds], // Add all in group
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route(resource + '.update-permissions', model.id), {});
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={model.name} />
            <div className="px-4 py-6">
                <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 dark:bg-zinc-900">
                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.name')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.name}</p>
                    </div>

                    <div className="space-y-1">
                        <h5 className="text-muted-foreground text-sm font-medium dark:text-zinc-300">{t('attributes.email')}</h5>
                        <p className="text-base font-semibold text-zinc-900 dark:text-white">{model.email}</p>
                    </div>
                </div>

                <form method="post" className="space-y-6" onSubmit={submit}>
                    <div className="mt-4 grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2 dark:bg-zinc-900">
                        <div className="grid gap-2">
                            <Label>{t('attributes.permissions')}</Label>
                            <InputError className="mt-2" message={errors.permissions} />
                            {Object.entries(permissions).map(([group, perms]) => (
                                <div key={group} className="mb-4">
                                    {/* Group Checkbox */}
                                    <div className="mb-2 flex items-center space-x-3">
                                        <Checkbox
                                            id={`group-${group}`}
                                            name="group-permissions"
                                            checked={perms.every((p) => data.permissions.includes(p.id))}
                                            onClick={() => handleGroupChange(group, perms)}
                                            tabIndex={3}
                                        />
                                        <Label htmlFor={`group-${group}`} className="font-bold">
                                            {group.toUpperCase()}
                                        </Label>
                                    </div>

                                    {/* Individual Permissions in Group */}
                                    <div className="ml-4">
                                        {perms.map((permission) => (
                                            <div key={permission.id} className="mb-2 flex items-center space-x-3">
                                                <Checkbox
                                                    id={`permission-${permission.id}`}
                                                    name="permissions"
                                                    checked={data.permissions.includes(permission.id)}
                                                    onClick={() => handelPermissionsChanged(permission.id)}
                                                    tabIndex={3}
                                                />
                                                <Label htmlFor={`permission-${permission.id}`}>{permission.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="">
                            <Label>{t('attributes.roles.title')}</Label>
                            <InputError className="mt-2" message={errors.roles} />
                            <div className="mt-3">
                                {roles.map((role) => (
                                    <div key={'role-' + role.id} className="mb-2 flex items-center space-x-3">
                                        <Checkbox
                                            id={`roles-${role.id}`}
                                            name="roles"
                                            checked={data.roles.includes(role.id)}
                                            onClick={() => handelRolesChanged(role.id)}
                                            tabIndex={3}
                                        />
                                        <Label htmlFor={`roles-${role.id}`}>{role.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button type="submit" className="w-auto" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {t('attributes.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
