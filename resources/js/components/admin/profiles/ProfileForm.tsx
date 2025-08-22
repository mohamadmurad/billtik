import InputWithSelect from '@/components/murad/InputWithSelect';
import MSelect from '@/components/murad/MSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { ProfileInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { AlertCircle, DollarSign, Download, HardDrive, LoaderCircle, Router, Save, Tag, Upload, Wifi } from 'lucide-react';
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

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{model ? t('Edit Profile') : t('Create New Profile')}</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('Configure network profile settings and bandwidth limits')}</p>
            </div>

            {/* Error Summary */}
            {hasErrors && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                        <h3 className="ml-2 text-sm font-medium text-red-800 dark:text-red-200">{t('Please correct the following errors:')}</h3>
                    </div>
                    <ul className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {Object.entries(errors).map(([field, error]) => (
                            <li key={field} className="mt-1">
                                • {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form method="post" className="space-y-8" onSubmit={submit}>
                {/* Network Configuration Section */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                        <div className="flex items-center">
                            <Router className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{t('Network Configuration')}</h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('Basic profile and router settings')}</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Router className="h-4 w-4 text-gray-400" />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('attributes.router')}</label>
                                </div>
                                <MSelect
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

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('attributes.name')}</label>
                                </div>
                                <Input
                                    id="name"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoComplete="name"
                                    placeholder={t('Enter profile name')}
                                    error={errors['name']}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bandwidth Limits Section */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                        <div className="flex items-center">
                            <HardDrive className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{t('Bandwidth Limits')}</h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('Configure download and upload speed limits')}</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Download className="h-4 w-4 text-green-500" />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('attributes.download_limit')}</label>
                                </div>
                                <InputWithSelect
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
                                <div className="flex items-center space-x-2">
                                    <Upload className="h-4 w-4 text-blue-500" />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('attributes.upload_limit')}</label>
                                </div>
                                <InputWithSelect
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
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                        <div className="flex items-center">
                            <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{t('Pricing')}</h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('Set the price for this profile')}</p>
                    </div>

                    <div className="p-6">
                        <div className="max-w-md">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('attributes.price')}</label>
                                </div>
                                <Input
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
                    </div>
                </div>

                {/* Connection Type Indicator */}
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
                    <div className="flex items-center space-x-2">
                        <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {t('Connection Type')}: {data.connection_type === 'ppp' ? 'PPP' : 'Hotspot'}
                        </span>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-zinc-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                        disabled={processing}
                        className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                        {t('Reset')}
                    </Button>
                    <Button type="submit" disabled={processing} className="min-w-[120px] transition-all duration-200 hover:shadow-lg">
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                {t('Saving...')}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {t('attributes.save')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
