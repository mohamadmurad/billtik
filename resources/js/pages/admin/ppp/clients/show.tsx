import SubscriptionsTable from '@/components/admin/subscriptions/SubscriptionsTable';
import MSelect from '@/components/murad/MSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ClientInterface } from '@/types/models';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
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
    ShieldAlert,
    ShieldCheck,
    ShieldX,
    User,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Show() {
    const resource: string = 'company.ppp.clients';
    const { model } = usePage<SharedData<{ model: ClientInterface & { subscriptions?: any[] } }>>().props;
    const [showCredentials, setShowCredentials] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('company.dashboard'),
        },
        {
            title: t(`attributes.${resource}.title`),
            href: route(resource + '.index'),
        },
        {
            title: model.name ?? '',
            href: '#',
        },
    ];

    const { data, setData, post, processing, reset, errors } = useForm({
        profile_id: '',
        start_date: '',
        end_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(resource + '.subscriptions.store', model.id), {
            onSuccess: () => reset(),
        });
    };

    const enable = () => router.post(route('company.ppp.clients.enable', model.id));
    const disable = () => router.post(route('company.ppp.clients.disable', model.id));

    // Get status configuration
    const getStatusConfig = (status: string) => {
        const configs = {
            active: {
                label: 'Active',
                variant: 'default' as const,
                icon: ShieldCheck,
                bgColor: 'bg-green-50 dark:bg-green-950/20',
                borderColor: 'border-green-200 dark:border-green-800',
                textColor: 'text-green-700 dark:text-green-300',
            },
            disabled: {
                label: 'Disabled',
                variant: 'secondary' as const,
                icon: ShieldX,
                bgColor: 'bg-red-50 dark:bg-red-950/20',
                borderColor: 'border-red-200 dark:border-red-800',
                textColor: 'text-red-700 dark:text-red-300',
            },
            suspended: {
                label: 'Suspended',
                variant: 'destructive' as const,
                icon: ShieldAlert,
                bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
                borderColor: 'border-yellow-200 dark:border-yellow-800',
                textColor: 'text-yellow-700 dark:text-yellow-300',
            },
            pending: {
                label: 'Pending',
                variant: 'outline' as const,
                icon: Clock,
                bgColor: 'bg-blue-50 dark:bg-blue-950/20',
                borderColor: 'border-blue-200 dark:border-blue-800',
                textColor: 'text-blue-700 dark:text-blue-300',
            },
        };
        return configs[status as keyof typeof configs] || configs.disabled;
    };

    const statusConfig = getStatusConfig(model.status || 'disabled');
    const StatusIcon = statusConfig.icon;

    // Copy to clipboard functionality
    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Get client initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Calculate subscription status
    const getSubscriptionStatus = () => {
        if (!model.active_subscription) return null;
        const endDate = new Date(model.active_subscription.end_date);
        const now = new Date();
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) return { status: 'expired', days: Math.abs(daysRemaining) };
        if (daysRemaining <= 7) return { status: 'expiring', days: daysRemaining };
        return { status: 'active', days: daysRemaining };
    };

    const subscriptionStatus = getSubscriptionStatus();

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={model.name ?? ''} />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    <div className="space-y-8 p-6">
                        {/* Enhanced Header Section */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                                        <AvatarFallback className="bg-white/10 text-xl font-bold backdrop-blur-sm">
                                            {getInitials(model.name || 'UN')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-3xl font-bold">{model.name}</h1>
                                            <Badge
                                                className={cn('border-0 text-sm font-medium shadow-lg', statusConfig.bgColor, statusConfig.textColor)}
                                     'border-0 text-sm font-medium shadow-lg'                 <StatusIcon className="mr-1 h-4 w-4" />
                                                {statusConfig.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-white/80">
                                            <span className="flex items-center gap-1">
                                                <CreditCard className="h-4 w-4" />
                                                ID: {model.id}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                Created: {new Date(model.created_at).toLocaleDateString()}
                                            </span>
                                            {subscriptionStatus && (
                                                <span
                                                    className={cn(
                                                        'flex items-center gap-1 rounded-full px-3 py-1',
                                                        subscriptionStatus.status === 'expired'
                                                            ? 'bg-red-500/20 'flex items-center gap-1 rounded-full px-3 py-1'                          : subscriptionStatus.status === 'expiring'
                                                              ? 'bg-yellow-500/20 text-yellow-100'
                                                              : 'bg-green-500/20 text-green-100',
                                                    )}
                                                >
                                                    <Activity className="h-3 w-3" />
                                                    {subscriptionStatus.status === 'expired'
                                                        ? `Expired ${subscriptionStatus.days} days ago`
                                                        : subscriptionStatus.status === 'expiring'
                                                          ? `Expires in ${subscriptionStatus.days} days`
                                                          : `${subscriptionStatus.days} days remaining`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Action Buttons */}
                                <div className="flex gap-3">
                                    {model.abilities?.can_enable && (
                                        <Button
                                            onClick={enable}
                                            size="lg"
                                            className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                                        >
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            Enable Client
                                        </Button>
                                    )}
                                    {model.abilities?.can_disable && (
                                        <Button
                                            onClick={disable}
                                            size="lg"
                                            variant="destructive"
                                            className="border-red-400/30 bg-red-500/20 text-white backdrop-blur-sm hover:bg-red-500/30"
                                        >
                                            <ShieldX className="mr-2 h-4 w-4" />
                                            Disable Client
                                        </Button>
                                    )}
                                    <Button size="lg" className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Button>
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
                                                <span>Client Information</span>
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
                                                    value: model.email,
                                                    copyable: true
                                                },
                                                {
                                                    icon: Phone,
                                                    label: t('attributes.phone'),
                                                    value: model.phone,
                                                    copyable: true
                                                },
                                                {
                                                    icon: CreditCard,
                                                    label: t('attributes.id_number'),
                                                    value: model.id_number,
                                                    copyable: true
                                                },
                                                {
                                                    icon: Calendar,
                                                    label: t('attributes.created_at'),
                                                    value: new Date(model.created_at).toLocaleDateString()
                                                }
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
                                                                        onClick={() => copyToClipboard(value, label)}
                                                                    >
                                                                        {copiedField === label ? (
                                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                                        ) : (
                                                                            <Copy className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Copy {label}</TooltipContent>
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
                                                <span>Technical Configuration</span>
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
                                                        <p className="font-semibold">{model.router.name}</p>
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
                                                        value: model.mikrotik_username
                                                    },
                                                    {
                                                        label: t('attributes.mikrotik_password'),
                                                        value: model.mikrotik_password
                                                    }
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
                                                                        onClick={() => copyToClipboard(value, label)}
                                                                    >
                                                                        {copiedField === label ? (
                                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                                        ) : (
                                                                            <Copy className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Copy {label}</TooltipContent>
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
                                                <span>Subscriptions History</span>
                                            </div>
                                            <Badge variant="secondary" className="bg-muted/50">
                                                {model.subscriptions?.length ?? 0} total
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-hidden rounded-lg">
                                            <SubscriptionsTable
                                                type={'ppp'}
                                                resource={resource}
                                                items={{
                                                    data: model.subscriptions,
                                                    total: model.subscriptions?.length ?? 0,
                                                    links: [],
                                                    current_page: 1,
                                                    from: 1,
                                                    to: 1
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
                                            <span>Current Subscription</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {model.active_subscription ? (
                                            <div className="space-y-4">
                                                <div className="text-center">
                                                    <div
                                                        className={cn(
                                                            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
                                                            subscriptionStatus?.status === 'expired'
                                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                                : subscriptionStatus?.status === 'expiring'
                                                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                        )}
                                                    >
                                                        {subscriptionStatus?.status === 'expired' ? (
                                                            <XCircle className="h-4 w-4" />
                                                        ) : subscriptionStatus?.status === 'expiring' ? (
                                                            <AlertTriangle className="h-4 w-4" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4" />
                                                        )}
                                                        {subscriptionStatus?.status === 'expired'
                                                            ? 'Expired'
                                                            : subscriptionStatus?.status === 'expiring'
                                                              ? 'Expiring Soon'
                                                              : 'Active'}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    {[
                                                        {
                                                            icon: User,
                                                            label: t('attributes.profile'),
                                                            value: model.active_subscription.profile?.name
                                                        },
                                                        {
                                                            icon: Calendar,
                                                            label: t('attributes.start_date'),
                                                            value: model.active_subscription.start_date
                                                        },
                                                        {
                                                            icon: Calendar,
                                                            label: t('attributes.end_date'),
                                                            value: model.active_subscription.end_date
                                                        }
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
                                                <p className="text-muted-foreground">No active subscription</p>
                                                <p className="text-muted-foreground/70 mt-1 text-sm">Create a new subscription below</p>
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
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Activity className="mr-2 h-4 w-4" />
                                            View Usage Statistics
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Schedule Maintenance
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Advanced Settings
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Add New Subscription */}
                                <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                                                <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <span>Add New Subscription</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={submit} className="space-y-4">
                                            <div className="space-y-4">
                                                <MSelect
                                                    label={t('attributes.profile')}
                                                    value={String(data.profile_id)}
                                                    apiUrl={route('company.ppp.profiles.search', { is_synced: 1 })}
                                                    inputProps={{ id: 'profile' }}
                                                    onChange={(e) => setData('profile_id', String(e))}
                                                    error={errors['profile_id']}
                                                    dependencies={{ router_id: model.router_id }}
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
                </div>
            </AppLayout>
        </TooltipProvider>
    );
}
