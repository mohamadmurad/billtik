import InputWithSelect from '@/components/murad/InputWithSelect';
import MSelect from '@/components/murad/MSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { ProfileInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Form({ resource }: { resource: string }) {
    const { model } = usePage<SharedData<{ model: ProfileInterface }>>().props;

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: {
            en: model?.name?.en || '',
            ar: model?.name?.ar || '',
        },
        price: model?.price || '',
        download_input: model?.download_input || '',
        download_unit: model?.download_unit || 'm',
        upload_input: model?.upload_input || '',
        upload_unit: model?.upload_unit || 'm',
        router_id: model?.router_id || '',
        connection_type: model?.connection_type || 'ppp',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (model) {
            put(route(resource + '.update', model.id), {

            });
        } else {
            post(route(resource + '.store'), {

            });
        }
    };
    return (
        <form method="post" className="space-y-6" onSubmit={submit}>
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    <div className="grid gap-2">
                        <Input
                            label={t('attributes.name_en')}
                            id="name_en"
                            className="mt-1 block w-full"
                            value={data.name.en}
                            onChange={(e) => setData('name.en', e.target.value)}
                            autoComplete="name"
                            placeholder={t('attributes.name_en')}
                            error={errors['name.en']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            label={t('attributes.name_ar')}
                            id="name_ar"
                            className="mt-1 block w-full"
                            value={data.name.ar}
                            onChange={(e) => setData('name.ar', e.target.value)}
                            autoComplete="name"
                            placeholder={t('attributes.name_ar')}
                            error={errors['name.ar']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <InputWithSelect
                            label={t('attributes.download_limit')}
                            inputProps={{
                                id: 'download_limit',
                                value: data.download_input,
                                onChange: (e) => setData('download_input', e.target.value),
                                placeholder: t('attributes.download_limit'),
                                type: 'number',
                            }}
                            selectProps={{
                                value: data.download_unit,
                                onValueChange: (e) => setData('download_unit', e),
                            }}
                            options={[
                                {
                                    label: 'Mb',
                                    value: 'm',
                                },
                                {
                                    label: 'Gb',
                                    value: 'g',
                                },
                                {
                                    label: 'Kb',
                                    value: 'k',
                                },
                            ]}
                            className="mt-1 block w-full"
                            error={errors['download_input']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <InputWithSelect
                            label={t('attributes.upload_limit')}
                            inputProps={{
                                id: 'upload_limit',
                                value: data.upload_input,
                                onChange: (e) => setData('upload_input', e.target.value),
                                placeholder: t('attributes.upload_limit'),
                                type: 'number',
                            }}
                            selectProps={{
                                value: data.upload_unit,
                                onValueChange: (e) => setData('upload_unit', e),
                            }}
                            options={[
                                {
                                    label: 'Mb',
                                    value: 'm',
                                },
                                {
                                    label: 'Gb',
                                    value: 'g',
                                },
                                {
                                    label: 'Kb',
                                    value: 'k',
                                },
                            ]}
                            className="mt-1 block w-full"
                            error={errors['upload_input']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            label={t('attributes.price')}
                            id="price"
                            className="mt-1 block w-full"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            placeholder={t('attributes.price')}
                            error={errors['price']}
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
