import SubscriptionsTable from '@/components/admin/subscriptions/SubscriptionsTable';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { copyToClipboard, getInitials } from '@/helpers';
import { t } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { ClientInterface } from '@/types/models';
import {
    Activity,
    Calendar,
    Copy,
    CreditCard,
    ExternalLink,
    Eye,
    EyeOff,
    LoaderCircle,
    Mail,
    MoreHorizontal,
    Phone,
    Plus,
    Router,
    Settings,
    Shield,
    ShieldCheck,
    ShieldX,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import MSelect from '@/components/murad/MSelect';
import { Input } from '@/components/ui/input';

interface ShowClientProps {
    client: ClientInterface;
    resource: string;
}

export default function ShowClient({ client, resource }: ShowClientProps) {
    const [showCredentials, setShowCredentials] = useState(false);

    const enable = () => router.post(route(resource + '.enable', client.id));
    const disable = () => router.post(route(resource + '.disable', client.id));
    const { data, setData, post, processing, reset, errors } = useForm({
        profile_id: '',
        start_date: '',
        end_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(resource + '.subscriptions.store', client.id), {
            onSuccess: () => reset(),
        });
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="space-y-8 p-6">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                                <AvatarFallback className="bg-white/10 text-xl font-bold backdrop-blur-sm">{getInitials(client.name)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold">{client.name}</h1>
                                    <Badge
                                        className={cn(
                                            'border-0 text-sm font-medium shadow-lg',
                                            client.status_meta.bgColor,
                                            client.status_meta.textColor,
                                        )}
                                    >
                                        {/*<StatusIcon className="mr-1 h-4 w-4" />*/}
                                        {client.status_meta.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-white/80">
                                    <span className="flex items-center gap-1">
                                        <CreditCard className="h-4 w-4" />
                                        ID: {client.id}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {t('attributes.created')}: {new Date(client.created_at).toLocaleDateString()}
                                    </span>
                                    {client.active_subscription && (
                                        <span
                                            className={cn(
                                                'flex items-center gap-1 rounded-full px-3 py-1',
                                                client.active_subscription.status_meta.bgColor,
                                                client.active_subscription.status_meta.textColor,
                                            )}
                                        >
                                            <Activity className="h-3 w-3" />
                                            {client.active_subscription.status_meta.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex gap-3">
                            {client.abilities?.can_enable && (
                                <Button
                                    onClick={enable}
                                    size="lg"
                                    className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                                >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    {t('attributes.enable')}
                                </Button>
                            )}
                            {client.abilities?.can_disable && (
                                <Button
                                    onClick={disable}
                                    size="lg"
                                    variant="destructive"
                                    className="border-red-400/30 bg-red-500/20 text-white backdrop-blur-sm hover:bg-red-500/30"
                                >
                                    <ShieldX className="mr-2 h-4 w-4" />
                                    {t('attributes.disable')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Information Grid */}
            <div className="grid gap-8 xl:grid-cols-3">
                {/* Left Column - Main Info */}
                <div className="space-y-6 xl:col-span-2">
                    {/* Client Information Card */}
                    <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span>{t('attributes.client_info')}</span>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                {[
                                    {
                                        icon: Mail,
                                        label: t('attributes.email'),
                                        value: client.email,
                                        copyable: true,
                                    },
                                    {
                                        icon: Phone,
                                        label: t('attributes.phone'),
                                        value: client.phone,
                                        copyable: true,
                                    },
                                    {
                                        icon: CreditCard,
                                        label: t('attributes.id_number'),
                                        value: client.id_number,
                                        copyable: true,
                                    },
                                    {
                                        icon: Calendar,
                                        label: t('attributes.created_at'),
                                        value: new Date(client.created_at).toLocaleDateString(),
                                    },
                                ].map(({ icon: Icon, label, value, copyable }, index) => (
                                    <div key={index} className="group space-y-3">
                                        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                            <Icon className="h-4 w-4" />
                                            {label}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-foreground flex-1 font-semibold">{value}</p>
                                            {copyable && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 transition-opacity group-hover:opacity-100"
                                                            onClick={() => copyToClipboard(value)}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {t('attributes.copy')} {label}
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Details Card */}
                    <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                                        <Router className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span>{t('attributes.technical_configuration')}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setShowCredentials(!showCredentials)}>
                                    {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Router className="text-muted-foreground h-5 w-5" />
                                        <div>
                                            <p className="text-muted-foreground text-sm">{t('attributes.router')}</p>
                                            <p className="font-semibold">{client.router.name}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Separator className="my-4" />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {[
                                        {
                                            label: t('attributes.mikrotik_username'),
                                            value: client.mikrotik_username,
                                        },
                                        {
                                            label: t('attributes.mikrotik_password'),
                                            value: client.mikrotik_password,
                                        },
                                    ].map(({ label, value }, index) => (
                                        <div key={index} className="group space-y-2">
                                            <div className="text-muted-foreground text-sm font-medium">{label}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-muted/50 flex-1 rounded-md p-3 font-mono text-sm">
                                                    {showCredentials ? value : '••••••••'}
                                                </div>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 transition-opacity group-hover:opacity-100"
                                                            onClick={() => copyToClipboard(value)}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {t('attributes.copy')} {label}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscriptions History */}
                    <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                        <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span>{t('attributes.subscriptions_history')}</span>
                                </div>
                                <Badge variant="secondary" className="bg-muted/50">
                                    {client.subscriptions?.length ?? 0} total
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-hidden rounded-lg">
                                <SubscriptionsTable
                                    type={'ppp'}
                                    resource={resource}
                                    items={{
                                        data: client.subscriptions,
                                        total: client.subscriptions?.length ?? 0,
                                        links: [],
                                        current_page: 1,
                                        from: 1,
                                        to: 1,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Current Subscription Status */}
                    <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3">
                                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <span>{t('attributes.current_subscription')}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {client.active_subscription ? (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div
                                            className={cn(
                                                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
                                                client.active_subscription.status_meta.bgColor,
                                                client.active_subscription.status_meta.textColor,
                                            )}
                                        >
                                            {client.active_subscription.status_meta.label}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            {
                                                icon: User,
                                                label: t('attributes.profile'),
                                                value: client.active_subscription.profile?.name,
                                            },
                                            {
                                                icon: Calendar,
                                                label: t('attributes.start_date'),
                                                value: client.active_subscription.start_date,
                                            },
                                            {
                                                icon: Calendar,
                                                label: t('attributes.end_date'),
                                                value: client.active_subscription.end_date,
                                            },
                                        ].map(({ icon: Icon, label, value }, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                                                    <Icon className="h-3 w-3" />
                                                    {label}
                                                </div>
                                                <p className="pl-5 text-sm font-semibold">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Shield className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                                    <p className="text-muted-foreground">{t('attributes.no_active_subscription')}</p>
                                    <p className="text-muted-foreground/70 mt-1 text-sm">{t('attributes.create_a_new_subscription_below')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3">
                                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                                    <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <span>Quick Actions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/*<Button variant="outline" className="w-full justify-start" size="sm">*/}
                            {/*    <Activity className="mr-2 h-4 w-4" />*/}
                            {/*    View Usage Statistics*/}
                            {/*</Button>*/}
                            {/*<Button variant="outline" className="w-full justify-start" size="sm">*/}
                            {/*    <Calendar className="mr-2 h-4 w-4" />*/}
                            {/*    Schedule Maintenance*/}
                            {/*</Button>*/}
                            {/*<Button variant="outline" className="w-full justify-start" size="sm">*/}
                            {/*    <Settings className="mr-2 h-4 w-4" />*/}
                            {/*    Advanced Settings*/}
                            {/*</Button>*/}
                        </CardContent>
                    </Card>

                    {/* Add New Subscription */}
                    <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3">
                                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                                    <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span>{t('attributes.add_new_subscription')}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-4">
                                    <MSelect
                                        label={t('attributes.profile')}
                                        value={String(data.profile_id)}
                                        apiUrl={route(resource.replace('clients', '') + 'profiles.search', {
                                            is_synced: 1,
                                            is_active: 1,
                                        })}
                                        inputProps={{ id: 'profile' }}
                                        onChange={(e) => setData('profile_id', String(e))}
                                        error={errors['profile_id']}
                                        dependencies={{ router_id: client.router_id }}
                                    />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Input
                                            label={t('attributes.start_date')}
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            error={errors['start_date']}
                                        />
                                        <Input
                                            label={t('attributes.end_date')}
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            error={errors['end_date']}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={processing} size="lg">
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Subscription...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            {t('attributes.save')}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
