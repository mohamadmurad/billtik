import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { CompanyInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Form({ resource }: { resource: string }) {
    const { model } = usePage<SharedData<{ model: CompanyInterface }>>().props;

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: {
            en: model?.name?.en || '',
            ar: model?.name?.ar || '',
        },
        settings: {
            generate_invoice_before: model?.settings?.generate_invoice_before || '',
        },
        user: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
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
                        <Label htmlFor="name">{t('attributes.name_en')}</Label>
                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name.en}
                            onChange={(e) => setData('name.en', e.target.value)}
                            autoComplete="name"
                            placeholder={t('attributes.name_en')}
                        />
                        <InputError className="mt-2" message={errors['name.en']} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('attributes.name_ar')}</Label>
                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name.ar}
                            onChange={(e) => setData('name.ar', e.target.value)}
                            autoComplete="name"
                            placeholder={t('attributes.name_ar')}
                        />
                        <InputError className="mt-2" message={errors['name.ar']} />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            type={'number'}
                            required={true}
                            id="email"
                            label={t('attributes.generate_invoice_before_days')}
                            className="mt-1 block w-full"
                            value={data.settings.generate_invoice_before}
                            onChange={(e) => setData('settings.generate_invoice_before', e.target.value)}
                            autoComplete="off"
                            placeholder={t('attributes.generate_invoice_before_days')}
                            error={errors['settings.generate_invoice_before']}
                        />
                    </div>
                </div>
            </div>
            {!model && (
                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Input
                                required={true}
                                id="name"
                                label={t('attributes.name')}
                                className="mt-1 block w-full"
                                value={data.user.name}
                                onChange={(e) => setData('user.name', e.target.value)}
                                autoComplete="name"
                                placeholder={t('attributes.name')}
                                error={errors['user.name']}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                required={true}
                                id="email"
                                label={t('attributes.email')}
                                className="mt-1 block w-full"
                                value={data.user.email}
                                onChange={(e) => setData('user.email', e.target.value)}
                                autoComplete="email"
                                placeholder={t('attributes.email')}
                                error={errors['user.email']}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Input
                                required={model == null}
                                id="password"
                                type="password"
                                label={t('attributes.password')}
                                className="mt-1 block w-full"
                                value={data.user.password}
                                onChange={(e) => setData('user.password', e.target.value)}
                                autoComplete="none"
                                placeholder={t('attributes.password')}
                                error={errors['user.password']}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                required={model == null}
                                type="password"
                                id="password_confirmation"
                                label={t('attributes.password_confirmation')}
                                className="mt-1 block w-full"
                                value={data.user.password_confirmation}
                                onChange={(e) => setData('user.password_confirmation', e.target.value)}
                                autoComplete="none"
                                placeholder={t('attributes.password_confirmation')}
                                error={errors['user.password_confirmation']}
                            />
                        </div>
                    </div>
                </div>
            )}

            <Button type="submit" className="mt-4" disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {t('attributes.save')}
            </Button>
        </form>
    );
}
