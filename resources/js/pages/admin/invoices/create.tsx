import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MSelect from '@/components/murad/MSelect';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface ClientDetailsResponse {
    active_subscription?: {
        id: number;
        profile?: { id: number; name: string; price: string };
    } | null;
    profiles: { id: number; name: string; price: string }[];
}

export default function Create() {
    const resource: string = 'company.invoices';
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('attributes.dashboard'), href: route('company.dashboard') },
        { title: t('attributes.company.invoices.title'), href: route(resource + '.index') },
        { title: t('attributes.company.invoices.create_head'), href: route(resource + '.create') },
    ];

    const { data, setData, post, processing, errors } = useForm({
        router_id: '',
        client_key: '', // type:id
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
    const [activeProfileName, setActiveProfileName] = useState<string>('');

    useEffect(() => {
        if (!data.client_id || !data.client_type) return;
        const url = route('company.invoices.client-details', { client_id: data.client_id, client_type: data.client_type });
        fetch(url)
            .then((r) => r.json())
            .then((res: ClientDetailsResponse) => {
                const { active_subscription, profiles } = res;
                setProfiles(profiles || []);
                if (active_subscription && active_subscription.id) {
                    setData('subscription_id', String(active_subscription.id));
                    setActiveSubscriptionId(String(active_subscription.id));
                    if (active_subscription.profile) {
                        setActiveProfileName(active_subscription.profile.name);
                        if (!data.unit_price) setData('unit_price', String(active_subscription.profile.price));
                    }
                } else {
                    setActiveSubscriptionId('');
                    setActiveProfileName('');
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.client_id, data.client_type]);

    useEffect(() => {
        if (data.profile_id) {
            const p = profiles.find((x) => String(x.id) === String(data.profile_id));
            if (p) setData('unit_price', p.price);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.profile_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(resource + '.store'));
    };

    const selectedProfileName = activeSubscriptionId ? activeProfileName : profiles.find((p) => String(p.id) === String(data.profile_id))?.name || '';

    const total = (Number(data.unit_price || 0) + Number(data.tax_amount || 0) - Number(data.discount_amount || 0)).toFixed(2);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('attributes.company.invoices.create_title')} />
            <div className="px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1: Router | Client */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t('attributes.router')}</Label>
                            <MSelect
                                value={String(data.router_id)}
                                apiUrl={route('company.routers.search')}
                                inputProps={{ id: 'router' }}
                                onChange={(e) => {
                                    setData('router_id', String(e));
                                    setData('client_key', '');
                                    setData('client_id', '');
                                    setData('subscription_id', '');
                                    setActiveSubscriptionId('');
                                    setActiveProfileName('');
                                    setProfiles([]);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('attributes.client')}</Label>
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
                                    setData('subscription_id', '');
                                    setData('profile_id', '');
                                    setActiveSubscriptionId('');
                                    setActiveProfileName('');
                                }}
                            />
                            {errors.client_id && <p className="text-destructive text-xs">{errors.client_id}</p>}
                        </div>
                    </div>

                    {/* Row 2: Issue Date | Due Date */}
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

                    {/* Items table */}
                    <div className="space-y-2">
                        <Label>Items</Label>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/30 border-b">
                                        <th className="px-3 py-2 text-left font-medium">Type</th>
                                        <th className="px-3 py-2 text-left font-medium">Item</th>
                                        <th className="px-3 py-2 text-right font-medium">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-muted/20 border-b">
                                        <td className="px-3 py-2">List Subscription</td>
                                        <td className="px-3 py-2">
                                            {activeSubscriptionId ? (
                                                <div className="text-sm">{activeProfileName || 'Active Subscription'}</div>
                                            ) : (
                                                <select
                                                    className="border-input bg-background text-foreground h-10 w-full rounded-md border px-3 py-2 text-sm"
                                                    value={String(data.profile_id)}
                                                    onChange={(e) => setData('profile_id', e.target.value)}
                                                >
                                                    <option value="">Select profile</option>
                                                    {profiles.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    inputMode="decimal"
                                                    className="w-32 text-right tabular-nums"
                                                    value={String(data.unit_price)}
                                                    onChange={(e) => setData('unit_price', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary card with discount/tax and totals */}
                    <div className="space-y-3">
                        <Label>Summary</Label>
                        <div className="rounded-md border p-3">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/30 border-b">
                                        <th className="px-3 py-2 text-left font-medium">Type</th>
                                        <th className="px-3 py-2 text-left font-medium">Name</th>
                                        <th className="px-3 py-2 text-right font-medium">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-3 py-2">Subscription</td>
                                        <td className="px-3 py-2">{selectedProfileName || '-'}</td>
                                        <td className="px-3 py-2 text-right">{Number(data.unit_price || 0).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Discount</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        inputMode="decimal"
                                        value={String(data.discount_amount)}
                                        onChange={(e) => setData('discount_amount', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        inputMode="decimal"
                                        value={String(data.tax_amount)}
                                        onChange={(e) => setData('tax_amount', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="my-3 border-t" />
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Amount</span>
                                    <span>{Number(data.unit_price || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Tax</span>
                                    <span>{Number(data.tax_amount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Discount</span>
                                    <span>-{Number(data.discount_amount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
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
