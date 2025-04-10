import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { type SharedData, User } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Form({ resource }: { resource: string }) {
    const { model } = usePage<
        SharedData<{
            model: User;
        }>
    >().props;

    const { data, setData, post, put, reset, errors, processing, recentlySuccessful } = useForm({
        name: model?.name || '',
        email: model?.email || '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (model) {
            put(route(resource + '.update', model.id), {
                onFinish: () => reset(,
            });
        } else {
            post(route(resource + '.store'), {
                onSuccess: () => reset(),
                onError: () => reset('password', 'password_confirmation')
            });
        }
    };
    return (
        <form method="post" className="space-y-6" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <Input
                        required={true}
                        id="name"
                        label={t('attributes.name')}
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                        placeholder={t('attributes.name')}
                        error={errors.name}
                    />
                </div>
                <div className="grid gap-2">
                    <Input
                        required={true}
                        id="email"
                        label={t('attributes.email')}
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="email"
                        placeholder={t('attributes.email')}
                        error={errors.email}
                    />
                </div>
                <div className="grid gap-2">
                    <Input
                        required={model == null}
                        id="password"
                        type="password"
                        label={t('attributes.password')}
                        className="mt-1 block w-full"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="none"
                        placeholder={t('attributes.password')}
                        error={errors.password}
                    />
                </div>
                <div className="grid gap-2">
                    <Input
                        required={model == null}
                        type="password"
                        id="password_confirmation"
                        label={t('attributes.password_confirmation')}
                        className="mt-1 block w-full"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="none"
                        placeholder={t('attributes.password_confirmation')}
                        error={errors.password_confirmation}
                    />
                </div>
            </div>
            <Button type="submit" className="mt-4" disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {t('attributes.save')}
            </Button>
        </form>
    );
}
