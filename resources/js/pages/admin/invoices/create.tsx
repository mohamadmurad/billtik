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

    const { data, setData, post, processing, errors } = useForm({
        router_id: '',
        client_key: '',
        client_id: '',
        client_type: 'ppp' as 'ppp' | 'hotspot',
        subscription_id: '',
        profile_id: '',
        unit_price: '',
        tax_amount: '',
        discount_amount: '',
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
                                <MSelect
                                    value={String(data.client_key)}
                                    apiUrl={route('company.invoices.clients-search')}
                                    inputProps={{ id: 'client' }}
                                    dependencies={{ router_id: data.router_id }}
                                    onChange={(e) => {
                                        const [type, id] = String(e).split(':');
                                        setData('client_key', String(e));
                                        setData('client_type', type as 'ppp' | 'hotspot');
                                        setData('client_id', id);
                                    }}
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Price</Label>
                            <Input type="number" value={String(data.unit_price)} onChange={(e) => setData('unit_price', e.target.value)} placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label>Tax</Label>
                            <Input type="number" value={String(data.tax_amount)} onChange={(e) => setData('tax_amount', e.target.value)} placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label>Discount</Label>
                            <Input type="number" value={String(data.discount_amount)} onChange={(e) => setData('discount_amount', e.target.value)} placeholder="0.00" />
                        </div>
                    </div>

                    <div className="rounded-md border p-4">
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center justify-between">
                                <span>Amount</span>
                                <span>{Number(data.unit_price || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Tax</span>
                                <span>{Number(data.tax_amount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Discount</span>
                                <span>-{Number(data.discount_amount || 0).toFixed(2)}</span>
                            </div>
                            <div className="border-t my-2" />
                            <div className="flex items-center justify-between font-semibold">
                                <span>Total</span>
                                <span>{(Number(data.unit_price || 0) + Number(data.tax_amount || 0) - Number(data.discount_amount || 0)).toFixed(2)}</span>
                            </div>
                        </div>
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
