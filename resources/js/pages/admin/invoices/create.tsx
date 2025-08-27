import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MSelect from '@/components/murad/MSelect';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create() {
    const resource: string = 'company.invoices';
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attributes.dashboard'),
            href: route('company.dashboard'),
        },
        {
            title: t('attributes.company.invoices.title'),
            href: route(resource + '.index'),
        },
        {
            title: t('attributes.company.invoices.create_head'),
            href: route(resource + '.create'),
        },
    ];

    const { data, setData, post, processing, errors, transform } = useForm({
        client_type: 'ppp' as 'ppp' | 'hotspot',
        router_id: '',
        client_id: '',
        subscription_id: '',
        profile_id: '',
        issue_date: new Date().toISOString().slice(0, 10),
        due_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10),
        description: '',
    });

    const [profiles, setProfiles] = useState<{ id: number; name: string; price: string }[]>([]);
    const [activeSubscriptionId, setActiveSubscriptionId] = useState<string>('');

    useEffect(() => {
        if (!data.client_id || !data.client_type) return;
        const url = route('company.invoices.client-details', {
            client_id: data.client_id,
            client_type: data.client_type,
        });
        fetch(url)
            .then((r) => r.json())
            .then((res) => {
                const { active_subscription, profiles } = res;
                setProfiles(profiles || []);
                if (active_subscription && active_subscription.id) {
                    setData('subscription_id', String(active_subscription.id));
                    setActiveSubscriptionId(String(active_subscription.id));
                } else {
                    setActiveSubscriptionId('');
                }
            });
    }, [data.client_id, data.client_type]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(resource + '.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('attributes.company.invoices.create_title')} />
            <div className="px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t('attributes.router')}</Label>
                            <MSelect
                                value={String(data.router_id)}
                                apiUrl={route('company.routers.search')}
                                inputProps={{ id: 'router' }}
                                onChange={(e) => {
                                    setData('router_id', String(e));
                                    setData('client_id', '');
                                    setProfiles([]);
                                    setActiveSubscriptionId('');
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('attributes.client')}</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    className="border-input bg-background text-foreground h-10 rounded-md border px-3 py-2 text-sm"
                                    value={data.client_type}
                                    onChange={(e) => setData('client_type', e.target.value as 'ppp' | 'hotspot')}
                                >
                                    <option value="ppp">PPP</option>
                                    <option value="hotspot">Hotspot</option>
                                </select>
                                <MSelect
                                    value={String(data.client_id)}
                                    apiUrl={
                                        data.client_type === 'ppp' ? route('company.ppp.clients.search') : route('company.hotspot.clients.search')
                                    }
                                    inputProps={{ id: 'client' }}
                                    dependencies={{ router_id: data.router_id }}
                                    onChange={(e) => setData('client_id', String(e))}
                                />
                            </div>
                            {errors.client_id && <p className="text-destructive text-xs">{errors.client_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t('attributes.subscription')}</Label>
                            <select
                                className="border-input bg-background text-foreground h-10 w-full rounded-md border px-3 py-2 text-sm"
                                value={String(data.subscription_id)}
                                onChange={(e) => setData('subscription_id', e.target.value)}
                            >
                                <option value="">Select subscription (auto if active)</option>
                                {activeSubscriptionId && <option value={activeSubscriptionId}>Active Subscription</option>}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('attributes.profile')}</Label>
                            <select
                                className="border-input bg-background text-foreground h-10 w-full rounded-md border px-3 py-2 text-sm"
                                value={String(data.profile_id)}
                                onChange={(e) => setData('profile_id', e.target.value)}
                                disabled={!!activeSubscriptionId}
                            >
                                <option value="">Select profile</option>
                                {profiles.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} - {p.price}
                                    </option>
                                ))}
                            </select>
                            {activeSubscriptionId && <p className="text-muted-foreground text-xs">Active subscription selected automatically.</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Issue Date</Label>
                            <Input type="date" value={data.issue_date} onChange={(e) => setData('issue_date', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={processing}>
                            {t('attributes.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
