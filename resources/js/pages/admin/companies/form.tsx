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
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (model) {
            put(route(resource + '.update', model.id), {
                onFinish: () => reset(),
            });
        } else {
            post(route(resource + '.store'), {
                onFinish: () => reset(),
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
                </div>
            </div>
            <Button type="submit" className="mt-4" disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {t('attributes.save')}
            </Button>
        </form>
    );
}
