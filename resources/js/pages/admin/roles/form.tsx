import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GroupedPermissionsInterface, RoleInterface } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { t } from '@/hooks/useTranslation';

export default function Form({ resource }: { resource: string }) {

    const { permissions, role } = usePage<SharedData<{
        permissions: GroupedPermissionsInterface,
        role: RoleInterface
    }>>().props;

    const { data, setData, post, put, reset, errors, processing, recentlySuccessful } = useForm({
        name: role?.name || '',
        permissions: role?.permissions?.map((permission) => permission.id) || []
    });
    const handelPermissionsChanged = (permissionId: number) => {

        setData('permissions', data.permissions.includes(permissionId)
            ? data.permissions.filter(id => id !== permissionId) // Remove if already selected
            : [...data.permissions, permissionId] // Add if not selected
        );
    };
    const handleGroupChange = (group: string, permissions: { id: number }[]) => {
        const groupIds = permissions.map(p => p.id);
        const isSelected = groupIds.every(id => data.permissions.includes(id));

        setData('permissions', isSelected
            ? data.permissions.filter(id => !groupIds.includes(id)) // Remove all in group
            : [...data.permissions, ...groupIds] // Add all in group
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (role) {
            put(route(resource + '.update', role.id), {
                onFinish: () => reset()
            });
        } else {
            post(route(resource + '.store'), {
                onFinish: () => reset()
            });
        }

    };
    return (
        <form method="post" className="space-y-6" onSubmit={submit}>
            <div className="grid gap-2">
                <Label htmlFor="name">{t('attributes.name')}</Label>
                <Input
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}

                    autoComplete="name"
                    placeholder={t('attributes.name')}
                />
                <InputError className="mt-2" message={errors.name} />

            </div>
            <div className="grid gap-2">
                <Label>{t('attributes.permissions')}</Label>

                <InputError className="mt-2" message={errors.permissions} />
                {Object.entries(permissions).map(([group, perms]) => (
                    <div key={group} className="mb-4">
                        {/* Group Checkbox */}
                        <div className="flex items-center space-x-3 mb-2">
                            <Checkbox
                                id={`group-${group}`}
                                name="group-permissions"
                                checked={perms.every(p => data.permissions.includes(p.id))}
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
                                <div key={permission.id} className="flex items-center space-x-3  mb-2">
                                    <Checkbox
                                        id={`permission-${permission.id}`}
                                        name="permissions"
                                        checked={data.permissions.includes(permission.id)}
                                        onClick={() => handelPermissionsChanged(permission.id)}
                                        tabIndex={3}
                                    />
                                    <Label htmlFor={`permission-${permission.id}`}>
                                        {permission.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
            <Button type="submit" className="mt-4 " disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {t('attributes.save')}
            </Button>
        </form>

    );
}
