import ToggleActive from '@/components/murad/ToggleActive';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { t } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { ProfileInterface } from '@/types/models';
import { Link } from '@inertiajs/react';
import { Activity, Calendar, CheckCircle, Edit, ExternalLink, Globe, Router, Shield, Wifi, XCircle, Zap } from 'lucide-react';

interface ShowProfileProps {
    profile: ProfileInterface;
    resource: string;
}

export default function ShowProfile({ resource, profile }: ShowProfileProps) {
    const bgColor = profile.is_active ? 'bg-green-50 dark:bg-green-950/20' : 'bg-gray-50 dark:bg-gray-950/20';
    const textColor = profile.is_active ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300';
    const label = profile.is_active ? t('attributes.active') : t('attributes.disabled');
    const StatusIcon = profile.is_active ? CheckCircle : XCircle;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="space-y-8 p-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/*header*/}
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white/20 bg-white/10 shadow-xl backdrop-blur-sm">
                                <Shield className="h-10 w-10" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Wifi className="h-3 w-3" />
                                        {profile.connection_type === 'ppp' ? t('attributes.ppp_profile') : t('attributes.hotspot_profile')}
                                    </Badge>
                                    <Badge className={cn('border-0 text-xs font-medium shadow-lg', bgColor, textColor)}>
                                        <StatusIcon className="mr-1 h-4 w-4" />
                                        {label}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-white/80">
                                    <span className="flex items-center gap-1">
                                        <Router className="h-4 w-4" />
                                        {t('attributes.router')}: {profile.router?.name}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {t('attributes.created')}: {new Date(profile.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {profile.abilities.toggleActive && (
                                <ToggleActive
                                    id={profile.id}
                                    className={'data-[state=checked]:bg-white/50 data-[state=unchecked]:bg-white/10'}
                                    thumbClassName={'data-[state=unchecked]:bg-white/50 data-[state=checked]:bg-white'}
                                    is_active={profile.is_active}
                                    resource={resource}
                                />
                            )}
                            {profile.abilities.edit && (
                                <Link href={route(resource + '.edit', profile.id)}>
                                    <Button size="lg" className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                                        <Edit className="mr-2 h-4 w-4" />
                                        {t('attributes.edit')}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
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
                                        <span>{t('attributes.profile_info')}</span>
                                    </div>
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
                                            <p className="text-foreground text-lg font-semibold">{profile.name}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                                <Activity className="h-4 w-4" />
                                                {t('attributes.status')}
                                            </div>
                                            <Badge className={cn('border-0 text-xs font-medium shadow-lg', bgColor, textColor)}>
                                                <StatusIcon className="mr-1 h-4 w-4" />
                                                {label}
                                            </Badge>
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
                                                <span className="font-semibold">{profile.router?.name}</span>
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
                                            <p className="text-foreground font-semibold">{new Date(profile.created_at).toLocaleString()}</p>
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
                                    <span>{t('attributes.profile_stats')}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">{t('attributes.status')}</span>
                                        <Badge className={cn('border-0 text-xs font-medium shadow-lg', bgColor, textColor)}>
                                            <StatusIcon className="mr-1 h-4 w-4" />
                                            {label}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">{t('attributes.active_since')}</span>
                                        <span className="text-sm font-medium">{new Date(profile.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">{t('attributes.router')}</span>
                                        <span className="text-sm font-medium">{profile.router?.name}</span>
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
                                    <span>{t('attributes.quick_actions')}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {profile.abilities.edit && (
                                    <Link href={route(resource + '.edit', profile.id)}>
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Edit className="mr-2 h-4 w-4" />
                                            {t('attributes.edit')}
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
