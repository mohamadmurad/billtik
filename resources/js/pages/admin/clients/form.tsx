import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { ClientInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import PhoneInput from '@/components/murad/PhoneInput';


export default function Form({ resource }: { resource: string }) {
    const { model } = usePage<SharedData<{ model: ClientInterface }>>().props;

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: model?.name || '',
        username: model?.username || '',
        password: model?.password || '',
        email: model?.email || '',
        phone: model?.phone || '',
        id_number: model?.id_number || '',
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
                    <div className="grid gap-2">
                        <Input
                            label={t('attributes.username')}
                            id="username"
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
                            type='password'
                            label={t('attributes.password')}
                            id="password"
                            className="mt-1 block w-full"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={t('attributes.password')}
                            error={errors['password']}
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
