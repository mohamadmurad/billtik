import MSelect from '@/components/murad/MSelect';
import PhoneInput from '@/components/murad/PhoneInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { ClientInterface, SelectOptionsInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Form({ resource }: { resource: string }) {
    const { model, profiles } = usePage<
        SharedData<{
            model: ClientInterface;
            profiles: SelectOptionsInterface[];
        }>
    >().props;

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: model?.name || '',
        mikrotik_username: model?.mikrotik_username || '',
        mikrotik_password: model?.mikrotik_password || '',
        email: model?.email || '',
        phone: model?.phone || '',
        id_number: model?.id_number || '',
        router_id: model?.router_id || '',
        profile_id: '',
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
            <h5 className="mb-0">{t('attributes.basic_info')}</h5>
            <div className="mt-2 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {!model && (
                        <div className="grid gap-2">
                            <MSelect
                                label={t('attributes.router')}
                                value={String(data.router_id)}
                                apiUrl={route('company.routers.search')}
                                id="router"
                                onChange={(e) => setData('router_id', String(e))}
                                error={errors['router_id']}
                            />
                        </div>
                    )}

                    {!model && (
                        <div className="grid gap-2">
                            <MSelect
                                label={t('attributes.profile')}
                                value={String(data.profile_id)}
                                apiUrl={route('company.ppp.profiles.search')}
                                id="profile"
                                onChange={(e) => setData('profile_id', String(e))}
                                error={errors['profile_id']}
                                dependencies={{ router_id: data.router_id }} // Pass router_id as dependency
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Input
                            label={t('attributes.mikrotik_username')}
                            id="mikrotik_username"
                            className="mt-1 block w-full"
                            value={data.mikrotik_username}
                            onChange={(e) => setData('mikrotik_username', e.target.value)}
                            autoComplete="mikrotik_username"
                            placeholder={t('attributes.mikrotik_username')}
                            error={errors['mikrotik_username']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            type="password"
                            label={t('attributes.mikrotik_password')}
                            id="mikrotik_password"
                            className="mt-1 block w-full"
                            value={data.mikrotik_password}
                            onChange={(e) => setData('mikrotik_password', e.target.value)}
                            placeholder={t('attributes.mikrotik_password')}
                            error={errors['mikrotik_password']}
                        />
                    </div>
                </div>
            </div>
            <h5 className="mb-0">{t('attributes.other_info')}</h5>
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Input
                            label={t('attributes.name')}
                            id="name"
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
                            label={t('attributes.email')}
                            id="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={t('attributes.email')}
                            error={errors['email']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            label={t('attributes.id_number')}
                            id="id_number"
                            className="mt-1 block w-full"
                            value={data.id_number}
                            onChange={(e) => setData('id_number', e.target.value)}
                            placeholder={t('attributes.id_number')}
                            error={errors['id_number']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <PhoneInput
                            className="mt-1 block w-full"
                            value={data.phone}
                            label={t('attributes.mobile')}
                            onChange={(phone) => setData('phone', phone)}
                            placeholder={t('attributes.phone')}
                            country="sy"
                            formNoValidate={false}
                            inputProps={{
                                required: false,
                            }}
                            onlyCountries={['sy']}
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
