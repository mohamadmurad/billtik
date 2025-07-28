import MSelect from '@/components/murad/MSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { RouterInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Form({ resource }: { resource: string }) {
    const { model } = usePage<SharedData<{ model: RouterInterface }>>().props;

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: model?.name || '',
        port: model?.port || '',
        ip: model?.ip || '',
        username: model?.username || '',
        password: model?.password || '',
        company_id: model?.company_id || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (model) {
            put(route(resource + '.update', model.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route(resource + '.store'), {
                onSuccess: () => reset(),
            });
        }
    };
    return (
        <form method="post" className="space-y-6" onSubmit={submit}>
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                        <MSelect
                            label={t('attributes.company')}
                            value={String(data.company_id)}
                            onChange={(e) => {
                                setData('company_id', String(e));
                            }}
                            apiUrl={route('admin.companies.search')}
                            error={errors['company_id']}
                        ></MSelect>
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="name"
                            label={t('attributes.name')}
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoComplete="name"
                            placeholder={t('attributes.name')}
                            error={errors['name']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="ip"
                            label={t('attributes.host')}
                            className="mt-1 block w-full"
                            value={data.ip}
                            onChange={(e) => setData('ip', e.target.value)}
                            autoComplete="ip"
                            placeholder={t('attributes.host')}
                            error={errors['ip']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="port"
                            label={t('attributes.port')}
                            className="mt-1 block w-full"
                            value={data.port}
                            onChange={(e) => setData('port', e.target.value)}
                            autoComplete="port"
                            placeholder={t('attributes.port')}
                            error={errors['port']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="username"
                            label={t('attributes.username')}
                            className="mt-1 block w-full"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            autoComplete="username"
                            placeholder={t('attributes.username')}
                            error={errors['username']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="password"
                            label={t('attributes.password')}
                            className="mt-1 block w-full"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="password"
                            placeholder={t('attributes.password')}
                            error={errors['password']}
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" className="mt-4" disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {t('attributes.save')}
            </Button>
        </form>
    );
}
