import InputWithSelect from '@/components/murad/InputWithSelect';
import MSelect from '@/components/murad/MSelect';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { ProfileInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { DollarSign, Download, HardDrive, LoaderCircle, Router, Save, Settings, Tag, Upload, Wifi } from 'lucide-react';
import { FormEventHandler } from 'react';

interface ProfileFormProps {
    resource: string;
    defaultConnectionType: 'ppp' | 'hotspot';
}

export default function ProfileForm({ resource, defaultConnectionType }: ProfileFormProps) {
    const { model } = usePage<SharedData<{ model: ProfileInterface }>>().props;

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: model?.name || '',
        price: model?.price || '',
        download_input: model?.download_input || '',
        download_unit: model?.download_unit || 'm',
        upload_input: model?.upload_input || '',
        upload_unit: model?.upload_unit || 'm',
        router_id: model?.router_id || '',
        connection_type: model?.connection_type || defaultConnectionType,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (model) {
            put(route(resource + '.update', model.id), {});
        } else {
            post(route(resource + '.store'), {});
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {model ? t(`attributes.${resource}.edit_head`) : t(`attributes.${resource}.create_head`)}
                            </h1>
                            <p className="text-muted-foreground text-sm">{t(`attributes.${resource}.create_description`)}</p>
                        </div>
                    </div>
                </div>

                <Badge variant="secondary" className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    {data.connection_type === 'ppp' ? t('attributes.ppp_profile') : t('attributes.hotspot_profile')}
                </Badge>
            </div>

            <form method="post" className="space-y-8" onSubmit={submit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Router className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{t('sections.profile_basic.title')}</h2>
                        </CardTitle>
                        <CardDescription>{t('sections.profile_basic.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {!model && (
                                <div className="space-y-2">
                                    <MSelect
                                        label={
                                            <div className="flex items-center space-x-2">
                                                <Router className="h-4 w-4 text-gray-400" />
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {t('attributes.router')}
                                                </label>
                                            </div>
                                        }
                                        value={String(data.router_id)}
                                        apiUrl={route('company.routers.search')}
                                        inputProps={{
                                            id: 'router',
                                            className: 'transition-all duration-200 focus:ring-2 focus:ring-blue-500',
                                        }}
                                        onChange={(e) => setData('router_id', String(e))}
                                        error={errors['router_id']}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Input
                                    id="name"
                                    label={
                                        <>
                                            <div className="flex items-center space-x-2">
                                                <Tag className="h-4 w-4 text-gray-400" />
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('attributes.name')}</label>
                                            </div>
                                        </>
                                    }
                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoComplete="name"
                                    placeholder={t('Enter profile name')}
                                    error={errors['name']}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{t('sections.profile_speed.title')}</h2>
                        </CardTitle>
                        <CardDescription>{t('sections.profile_speed.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-2">
                                <InputWithSelect
                                    label={
                                        <div className="flex items-center space-x-2">
                                            <Download className="h-4 w-4 text-green-500" />
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {t('attributes.download_limit')}
                                            </label>
                                        </div>
                                    }
                                    inputProps={{
                                        id: 'download_limit',
                                        value: data.download_input,
                                        onChange: (e) => setData('download_input', e.target.value),
                                        placeholder: t('Enter download limit'),
                                        type: 'number',
                                        min: '0',
                                        step: '0.1',
                                        className: 'transition-all duration-200 focus:ring-2 focus:ring-green-500',
                                    }}
                                    selectProps={{
                                        value: data.download_unit,
                                        onValueChange: (e) => setData('download_unit', e),
                                    }}
                                    options={[
                                        { label: 'Kb/s', value: 'k' },
                                        { label: 'Mb/s', value: 'm' },
                                        { label: 'Gb/s', value: 'g' },
                                    ]}
                                    error={errors['download_input']}
                                />
                            </div>

                            <div className="space-y-2">
                                <InputWithSelect
                                    label={
                                        <div className="flex items-center space-x-2">
                                            <Upload className="h-4 w-4 text-blue-500" />
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {t('attributes.upload_limit')}
                                            </label>
                                        </div>
                                    }
                                    inputProps={{
                                        id: 'upload_limit',
                                        value: data.upload_input,
                                        onChange: (e) => setData('upload_input', e.target.value),
                                        placeholder: t('Enter upload limit'),
                                        type: 'number',
                                        min: '0',
                                        step: '0.1',
                                        className: 'transition-all duration-200 focus:ring-2 focus:ring-blue-500',
                                    }}
                                    selectProps={{
                                        value: data.upload_unit,
                                        onValueChange: (e) => setData('upload_unit', e),
                                    }}
                                    options={[
                                        { label: 'Kb/s', value: 'k' },
                                        { label: 'Mb/s', value: 'm' },
                                        { label: 'Gb/s', value: 'g' },
                                    ]}
                                    error={errors['upload_input']}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{t('sections.pricing.title')}</h2>
                        </CardTitle>
                        <CardDescription>{t('sections.pricing.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="max-w-md">
                            <div className="space-y-2">
                                <Input
                                    label={
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="h-4 w-4 text-gray-400" />
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('attributes.price')}</label>
                                        </div>
                                    }
                                    id="price"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder={t('Enter price')}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    error={errors['price']}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-zinc-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                        disabled={processing}
                        className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                        {t('attributes.reset')}
                    </Button>
                    <Button type="submit" disabled={processing} className="min-w-[120px] transition-all duration-200 hover:shadow-lg">
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                {t('attributes.saving')}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {model ? t('attributes.update') : t('attributes.create')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
