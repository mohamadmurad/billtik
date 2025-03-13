import { type SharedData, User } from '@/types';
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

    const { permissions, model } = usePage<SharedData<{
       // permissions: GroupedPermissionsInterface,
        model: User
    }>>().props;

    const { data, setData, post, put, reset, errors, processing, recentlySuccessful } = useForm({
        // name: role?.name || '',
        // permissions: role?.permissions?.map((permission) => permission.id) || []
    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (model) {
            put(route(resource + '.update', model.id), {
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
                {/*<Label htmlFor="name">{t('attributes.name')}</Label>*/}
                {/*<Input*/}
                {/*    id="name"*/}
                {/*    className="mt-1 block w-full"*/}
                {/*    value={data.name}*/}
                {/*    onChange={(e) => setData('name', e.target.value)}*/}

                {/*    autoComplete="name"*/}
                {/*    placeholder={t('attributes.name')}*/}
                {/*/>*/}
                {/*<InputError className="mt-2" message={errors.name} />*/}

            </div>
            <div className="grid gap-2">
                <Label>{t('attributes.permissions')}</Label>

                {/*<InputError className="mt-2" message={errors.permissions} />*/}


            </div>
            <Button type="submit" className="mt-4 " disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {t('attributes.save')}
            </Button>
        </form>

    );
}
