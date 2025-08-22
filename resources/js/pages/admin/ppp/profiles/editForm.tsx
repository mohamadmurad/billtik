import InputWithSelect from '@/components/murad/InputWithSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { ProfileInterface } from '@/types/models';
import { useForm, usePage } from '@inertiajs/react';
import { DollarSign, Download, LoaderCircle, Save, Settings, Upload, Wifi, X } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function EditForm({ resource }: { resource: string }) {
    const { model } = usePage<SharedData<{ model: ProfileInterface }>>().props;

    const { data, setData, post, put, reset, errors, processing } = useForm({
        router_id: model?.router_id || '',
        name: model?.name || '',
        price: model?.price || '',
        download_input: model?.download_input || '',
        download_unit: model?.download_unit || 'm',
        upload_input: model?.upload_input || '',
        upload_unit: model?.upload_unit || 'm',
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
    const isEditing = !!model;

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {isEditing ? t('actions.edit') : t('actions.create')} {t('entities.profile')}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {isEditing ? t('messages.edit_profile_description') : t('messages.create_profile_description')}
                            </p>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        PPP Profile
                    </Badge>
                )}
            </div>

            {/* Error Summary */}
            {hasErrors && (
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <X className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div>
                                <h3 className="text-destructive font-medium">{t('messages.validation_errors')}</h3>
                                <p className="text-destructive/80 mt-1 text-sm">{t('messages.please_correct_errors')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <form onSubmit={submit} className="space-y-8">
                {/* Basic Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            {t('sections.basic_information')}
                        </CardTitle>
                        <CardDescription>{t('messages.basic_profile_info_description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-2">
                                <Input
                                    label={t('attributes.name')}
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoComplete="name"
                                    placeholder={t('placeholders.profile_name')}
                                    error={errors['name']}
                                    className="transition-all duration-200 focus:ring-2"
                                    required
                                />
                                <p className="text-muted-foreground text-xs">{t('hints.profile_name')}</p>
                            </div>

                            <div className="space-y-2">
                                <Input
                                    label={t('attributes.price')}
                                    id="price"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder={t('placeholders.price')}
                                    error={errors['price']}
                                    className="transition-all duration-200 focus:ring-2"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    icon={<DollarSign className="h-4 w-4" />}
                                />
                                <p className="text-muted-foreground text-xs">{t('hints.price')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bandwidth Limits Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wifi className="h-4 w-4" />
                            {t('sections.bandwidth_limits')}
                        </CardTitle>
                        <CardDescription>{t('messages.bandwidth_limits_description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Download Limit */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/20">
                                        <Download className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    {t('attributes.download_limit')}
                                </div>

                                <InputWithSelect
                                    inputProps={{
                                        id: 'download_limit',
                                        value: data.download_input,
                                        onChange: (e) => setData('download_input', e.target.value),
                                        placeholder: t('placeholders.download_limit'),
                                        type: 'number',
                                        min: '0',
                                        className: 'transition-all duration-200 focus:ring-2',
                                    }}
                                    selectProps={{
                                        value: data.download_unit,
                                        onValueChange: (e) => setData('download_unit', e),
                                    }}
                                    options={[
                                        {
                                            label: 'Kilobytes (KB)',
                                            value: 'k',
                                        },
                                        {
                                            label: 'Megabytes (MB)',
                                            value: 'm',
                                        },
                                        {
                                            label: 'Gigabytes (GB)',
                                            value: 'g',
                                        },
                                    ]}
                                    error={errors['download_input']}
                                />
                                <p className="text-muted-foreground text-xs">{t('hints.download_limit')}</p>
                            </div>

                            {/* Upload Limit */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/20">
                                        <Upload className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    {t('attributes.upload_limit')}
                                </div>

                                <InputWithSelect
                                    inputProps={{
                                        id: 'upload_limit',
                                        value: data.upload_input,
                                        onChange: (e) => setData('upload_input', e.target.value),
                                        placeholder: t('placeholders.upload_limit'),
                                        type: 'number',
                                        min: '0',
                                        className: 'transition-all duration-200 focus:ring-2',
                                    }}
                                    selectProps={{
                                        value: data.upload_unit,
                                        onValueChange: (e) => setData('upload_unit', e),
                                    }}
                                    options={[
                                        {
                                            label: 'Kilobytes (KB)',
                                            value: 'k',
                                        },
                                        {
                                            label: 'Megabytes (MB)',
                                            value: 'm',
                                        },
                                        {
                                            label: 'Gigabytes (GB)',
                                            value: 'g',
                                        },
                                    ]}
                                    error={errors['upload_input']}
                                />
                                <p className="text-muted-foreground text-xs">{t('hints.upload_limit')}</p>
                            </div>
                        </div>

                        {/* Bandwidth Preview */}
                        {(data.download_input || data.upload_input) && (
                            <div className="bg-muted/50 rounded-lg border p-4">
                                <h4 className="mb-2 text-sm font-medium">{t('labels.bandwidth_summary')}</h4>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {data.download_input && (
                                        <div className="flex items-center gap-2">
                                            <Download className="h-3 w-3 text-green-600" />
                                            <span className="text-muted-foreground">Download:</span>
                                            <span className="font-mono">
                                                {data.download_input} {data.download_unit.toUpperCase()}B
                                            </span>
                                        </div>
                                    )}
                                    {data.upload_input && (
                                        <div className="flex items-center gap-2">
                                            <Upload className="h-3 w-3 text-blue-600" />
                                            <span className="text-muted-foreground">Upload:</span>
                                            <span className="font-mono">
                                                {data.upload_input} {data.upload_unit.toUpperCase()}B
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="bg-muted/30 flex items-center justify-between rounded-lg border-t px-6 py-4">
                    <div className="text-muted-foreground text-sm">
                        {isEditing ? t('messages.changes_will_be_saved') : t('messages.profile_will_be_created')}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" onClick={() => reset()} disabled={processing}>
                            {t('actions.reset')}
                        </Button>

                        <Button type="submit" disabled={processing} className="min-w-[120px] transition-all duration-200 hover:scale-105">
                            {processing ? (
                                <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    {t('states.saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {isEditing ? t('actions.update') : t('actions.create')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
