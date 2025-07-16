import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { PackageInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Form({ resource }: { resource: string }) {
    const { model } = usePage<SharedData<{ model: PackageInterface }>>().props;

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: {
            en: model?.name?.en || '',
            ar: model?.name?.ar || '',
        },
        price: model?.price || '',
        download_input: model?.download_input || '',
        upload_input: model?.upload_input || '',
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
                        <Input
                            label={t('attributes.download_limit')}
                            id="download_limit"
                            className="mt-1 block w-full"
                            value={data.download_input}
                            onChange={(e) => setData('download_input', e.target.value)}
                            autoComplete="name"
                            placeholder={t('attributes.download_limit')}
                            error={errors['download_input']}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            label={t('attributes.upload_limit')}
                            id="upload_input"
                            className="mt-1 block w-full"
                            value={data.upload_input}
                            onChange={(e) => setData('upload_input', e.target.value)}
                            placeholder={t('attributes.upload_limit')}
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
