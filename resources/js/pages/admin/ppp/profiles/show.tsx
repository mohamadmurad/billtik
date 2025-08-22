import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ProfileInterface } from '@/types/models';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Activity,
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    Copy,
    Edit,
    ExternalLink,
    Globe,
    Router,
    Settings,
    Shield,
    XCircle,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Show() {
    const resource: string = 'company.ppp.profiles';
    const { model } = usePage<SharedData<{ model: ProfileInterface }>>().props;
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
            title: model.local_name || model.name,
            href: '#',
        },
    ];

    // Get status configuration
    const getStatusConfig = (status: string) => {
        const configs = {
            active: {
                label: 'Active',
                variant: 'default' as const,
                icon: CheckCircle,
                bgColor: 'bg-green-50 dark:bg-green-950/20',
                borderColor: 'border-green-200 dark:border-green-800',
                textColor: 'text-green-700 dark:text-green-300',
            },
            inactive: {
                label: 'Inactive',
                variant: 'secondary' as const,
                icon: XCircle,
                bgColor: 'bg-gray-50 dark:bg-gray-950/20',
                borderColor: 'border-gray-200 dark:border-gray-800',
                textColor: 'text-gray-700 dark:text-gray-300',
            },
            suspended: {
                label: 'Suspended',
                variant: 'destructive' as const,
                icon: AlertTriangle,
                bgColor: 'bg-red-50 dark:bg-red-950/20',
                borderColor: 'border-red-200 dark:border-red-800',
                textColor: 'text-red-700 dark:text-red-300',
            },
            pending: {
                label: 'Pending',
                variant: 'outline' as const,
                icon: Clock,
                bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
                borderColor: 'border-yellow-200 dark:border-yellow-800',
                textColor: 'text-yellow-700 dark:text-yellow-300',
            },
        };
        return configs[status as keyof typeof configs] || configs.inactive;
    };

    const statusConfig = getStatusConfig(model.status || 'inactive');
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={model.local_name || model.name} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="space-y-8 p-6">
                    {/* Enhanced Header Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-2xl">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white/20 bg-white/10 shadow-xl backdrop-blur-sm">
                                    <Shield className="h-10 w-10" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-bold">{model.local_name || model.name}</h1>
                                        <Badge className={cn('border-0 text-sm font-medium shadow-lg', statusConfig.bgColor, statusConfig.textColor)}>
                                            <StatusIcon className="mr-1 h-4 w-4" />
                                            {statusConfig.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-white/80">
                                        <span className="flex items-center gap-1">
                                            <Router className="h-4 w-4" />
                                            Router: {model.router?.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Created: {new Date(model.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Link href={route(resource + '.edit', model.id)}>
                                    <Button size="lg" className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </Link>
                                <Button size="lg" className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information Grid */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Information Card */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                                <CardHeader className="pb-6">
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                                                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <span>Profile Information</span>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(model.name, 'profile')}>
                                            {copiedField === 'profile' ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid gap-8 md:grid-cols-2">
                                        {/* Basic Details */}
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                                    <Globe className="h-4 w-4" />
                                                    {t('attributes.name')}
                                                </div>
                                                <p className="text-foreground text-lg font-semibold">{model.name}</p>
                                            </div>

                                            {model.local_name && (
                                                <div className="space-y-3">
                                                    <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                                        <Zap className="h-4 w-4" />
                                                        Local Name
                                                    </div>
                                                    <p className="text-foreground text-lg font-semibold">{model.local_name}</p>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                                    <Activity className="h-4 w-4" />
                                                    {t('attributes.status')}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <StatusIcon className={cn('h-5 w-5', statusConfig.textColor)} />
                                                    <span className={cn('font-semibold', statusConfig.textColor)}>{statusConfig.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Technical Details */}
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                                    <Router className="h-4 w-4" />
                                                    {t('attributes.router')}
                                                </div>
                                                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                                                    <span className="font-semibold">{model.router?.name}</span>
                                                    <Button variant="ghost" size="sm">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                                    <Calendar className="h-4 w-4" />
                                                    {t('attributes.created_at')}
                                                </div>
                                                <p className="text-foreground font-semibold">{new Date(model.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information Section */}
                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                                            <Settings className="h-5 w-5" />
                                            Configuration Details
                                        </h3>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {/* Add more profile-specific fields here */}
                                            <div className="space-y-2">
                                                <div className="text-muted-foreground text-sm font-medium">Profile Type</div>
                                                <Badge variant="outline">Standard Profile</Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="text-muted-foreground text-sm font-medium">Last Modified</div>
                                                <p className="text-sm font-medium">
                                                    {model.updated_at ? new Date(model.updated_at).toLocaleString() : 'Never'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span>Profile Stats</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground text-sm">Status</span>
                                            <Badge variant={statusConfig.variant}>
                                                <StatusIcon className="mr-1 h-3 w-3" />
                                                {statusConfig.label}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground text-sm">Active Since</span>
                                            <span className="text-sm font-medium">{new Date(model.created_at).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground text-sm">Router</span>
                                            <span className="text-sm font-medium">{model.router?.name}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-0 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-xl dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                            <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span>Quick Actions</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href={route(resource + '.edit', model.id)}>
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </Button>
                                    </Link>

                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <Copy className="mr-2 h-4 w-4" />
                                        Clone Profile
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Advanced Settings
                                    </Button>

                                    <Separator />

                                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" size="sm">
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Delete Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
