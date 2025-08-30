import MSelect from '@/components/murad/MSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { t } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ClientSubscriptionInterface } from '@/types/models';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle2, Clock, CreditCard, DollarSign, Minus, Plus, Receipt, Router, User, XCircle } from 'lucide-react';
import * as React from 'react';
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
        client_id: '',
        client_type: 'ppp' as 'ppp' | 'hotspot',
        subscription_id: '',
        profile_id: '',
        unit_price: '',
        quantity: '1',
        tax_amount: '',
        discount_amount: '',
        issue_date: new Date().toISOString().slice(0, 10),
        due_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10),
        description: '',
    });

    const [profiles, setProfiles] = useState<{ id: number; name: string; price: string }[]>([]);
    const [activeSubscription, setActiveSubscription] = useState<ClientSubscriptionInterface>(null);
    const [activeSubscriptionId, setActiveSubscriptionId] = useState<string>('');
    const [activeProfileName, setActiveProfileName] = useState<string>('');

    useEffect(() => {
        if (!data.client_id) return;
        const url = route('company.invoices.client-details', { client_id: data.client_id });
        fetch(url)
            .then((r) => r.json())
            .then((res: ClientDetailsResponse) => {
                const { active_subscription, profiles } = res;
                setProfiles(profiles || []);
                if (active_subscription && active_subscription.id) {
                    setActiveSubscription(active_subscription);
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
    }, [data.client_id]);

    useEffect(() => {
        if (data.profile_id) {
            const p = profiles.find((x) => String(x.id) === String(data.profile_id));
            if (p) setData('unit_price', p.price);
        }
    }, [data.profile_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route(resource + '.store'));
    };

    const subtotal = Number(data.unit_price || 0) * Number(data.quantity || 1);
    const tax = Number(data.tax_amount || 0);
    const discount = Number(data.discount_amount || 0);
    const total = subtotal + tax - discount;

    const adjustQuantity = (delta: number) => {
        const newQty = Math.max(1, Number(data.quantity || 1) + delta);
        setData('quantity', String(newQty));
    };

    const setQuickTax = (percentage: number) => {
        const taxAmount = ((subtotal * percentage) / 100).toFixed(2);
        setData('tax_amount', taxAmount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('attributes.company.invoices.create_title')} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
                <div className="mx-auto max-w-6xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
                                <Receipt className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Invoice</h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">Generate professional invoices for your clients</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Client Information Card */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:border-gray-700 dark:from-blue-900/20 dark:to-indigo-900/20">
                                <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    <User className="h-6 w-6 text-blue-600" />
                                    Client Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Select router and client for this invoice</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Router className="h-4 w-4 text-gray-500" />
                                            {t('attributes.router')}
                                        </Label>
                                        <MSelect
                                            value={String(data.router_id)}
                                            apiUrl={route('company.routers.search')}
                                            inputProps={{
                                                id: 'router',
                                                className: 'h-12 border-2 focus:border-blue-500 transition-colors',
                                            }}
                                            onChange={(e) => {
                                                setData('router_id', String(e));
                                                setData('client_id', '');
                                                setData('subscription_id', '');
                                                setActiveSubscriptionId('');
                                                setActiveProfileName('');
                                                setProfiles([]);
                                            }}
                                            error={errors['router_id']}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <User className="h-4 w-4 text-gray-500" />
                                            {t('attributes.client')}
                                        </Label>
                                        <MSelect
                                            value={String(data.client_id)}
                                            apiUrl={route('company.invoices.clients-search')}
                                            inputProps={{
                                                id: 'client',
                                                className: 'h-12 border-2 focus:border-blue-500 transition-colors',
                                            }}
                                            dependencies={{ router_id: data.router_id }}
                                            onChange={(e) => {
                                                setData('client_id', e);
                                                setData('subscription_id', '');
                                                setData('profile_id', '');
                                                setActiveSubscriptionId('');
                                                setActiveProfileName('');
                                            }}
                                            error={errors['client_id']}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details Card */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 dark:border-gray-700 dark:from-emerald-900/20 dark:to-teal-900/20">
                                <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    <Calendar className="h-6 w-6 text-emerald-600" />
                                    Invoice Details
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Set dates and description for the invoice</p>
                            </div>
                            <div className="p-6">
                                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            Issue Date
                                        </Label>
                                        <Input
                                            type="date"
                                            value={data.issue_date}
                                            onChange={(e) => setData('issue_date', e.target.value)}
                                            className="h-12 border-2 transition-colors focus:border-emerald-500"
                                            error={errors['issue_date']}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            Due Date
                                        </Label>
                                        <Input
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className="h-12 border-2 transition-colors focus:border-emerald-500"
                                            error={errors['due_date']}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</Label>
                                    <Input
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Optional invoice description or notes"
                                        className="h-12 border-2 transition-colors focus:border-emerald-500"
                                        error={errors['description']}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Invoice Items Card */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 dark:border-gray-700 dark:from-purple-900/20 dark:to-pink-900/20">
                                <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    <CreditCard className="h-6 w-6 text-purple-600" />
                                    Invoice Items
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Configure subscription details and quantity</p>
                            </div>
                            <div className="p-6">
                                {/* Enhanced Table */}
                                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="bg-gray-50 px-6 py-4 dark:bg-gray-900">
                                        <div className="grid grid-cols-12 gap-4 text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                            <div className="col-span-2">Item Type</div>
                                            <div className="col-span-4">Description</div>
                                            <div className="col-span-2 text-center">Quantity</div>
                                            <div className="col-span-2 text-right">Unit Price</div>
                                            <div className="col-span-2 text-right">Total</div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800">
                                        <div className="border-b border-gray-100 px-6 py-6 dark:border-gray-700">
                                            <div className="grid grid-cols-12 items-center gap-4">
                                                {/* Type Badge */}
                                                <div className="col-span-2">
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2 text-xs font-semibold text-white shadow-sm">
                                                        <CreditCard className="h-3 w-3" />
                                                        Subscription
                                                    </span>
                                                    {activeSubscription ? (
                                                        <div className="text-sm">
                                                            <span className="block">Start : {activeSubscription.start_date}</span>
                                                            <span>End date : {activeSubscription.end_date}</span>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                <div className="col-span-4">
                                                    {activeSubscriptionId ? (
                                                        <div className="space-y-2">
                                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                                {activeProfileName || 'Active Subscription'}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                                                                Currently active
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Select value={String(data.profile_id)} onValueChange={(e) => setData('profile_id', e)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={'select'}>
                                                                    {profiles.find((opt) => String(opt.value) === data.profile_id)?.label}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {profiles.map((p) => (
                                                                    <SelectItem key={p.id} value={p.id.toString()}>
                                                                        {p.name} - ${Number(p.price).toFixed(2)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="col-span-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => adjustQuantity(-1)}
                                                            disabled={Number(data.quantity) <= 1}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={String(data.quantity)}
                                                            onChange={(e) => setData('quantity', e.target.value)}
                                                            className="h-8 w-16 border-2 text-center text-sm font-semibold"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => adjustQuantity(1)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    {/*<div className="mt-1 text-center text-xs text-gray-500">months</div>*/}
                                                </div>

                                                {/* Unit Price */}
                                                <div className="col-span-2 text-right">
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform font-medium text-gray-500">
                                                            $
                                                        </span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={String(data.unit_price)}
                                                            onChange={(e) => setData('unit_price', e.target.value)}
                                                            placeholder="0.00"
                                                            className="h-12 border-2 pl-8 text-right font-semibold focus:border-purple-500"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Line Total */}
                                                <div className="col-span-2 text-right">
                                                    <div className="text-xl font-bold text-gray-900 tabular-nums dark:text-gray-100">
                                                        ${subtotal.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">line total</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Quantity Actions */}
                                <div className="mt-4 flex justify-between gap-3">
                                    <div className="flex gap-3">
                                        <Button type="button" variant="outline" size="sm" onClick={() => setData('quantity', '3')}>
                                            3 Months
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={() => setData('quantity', '6')}>
                                            6 Months
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={() => setData('quantity', '12')}>
                                            1 Year
                                        </Button>
                                    </div>
                                    <div>New End Date : {generatedEndDate}</div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 dark:border-gray-700 dark:from-green-900/20 dark:to-emerald-900/20">
                                <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                    Invoice Summary
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Review totals and apply adjustments</p>
                            </div>
                            <div className="p-6">
                                {/* Adjustments */}
                                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold text-red-600 dark:text-red-400">Discount Amount</Label>
                                        <div className="relative">
                                            <span className="absolute top-1/2 left-3 -translate-y-1/2 transform font-medium text-gray-500">$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                value={String(data.discount_amount)}
                                                onChange={(e) => setData('discount_amount', e.target.value)}
                                                placeholder="0.00"
                                                className="h-12 border-2 pl-8 font-semibold focus:border-red-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold text-amber-600 dark:text-amber-400">Tax Amount</Label>
                                        <div className="relative">
                                            <span className="absolute top-1/2 left-3 -translate-y-1/2 transform font-medium text-gray-500">$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                value={String(data.tax_amount)}
                                                onChange={(e) => setData('tax_amount', e.target.value)}
                                                placeholder="0.00"
                                                className="h-12 border-2 pl-8 font-semibold focus:border-amber-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Tax Buttons */}
                                <div className="mb-6 flex gap-2">
                                    <span className="py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Tax presets:</span>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setQuickTax(10)}>
                                        10%
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setQuickTax(15)}>
                                        15%
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setQuickTax(20)}>
                                        20%
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setData('tax_amount', '0')}>
                                        Clear
                                    </Button>
                                </div>

                                {/* Totals */}
                                <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-200 py-2 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Subtotal ({data.quantity} × ${Number(data.unit_price || 0).toFixed(2)})
                                            </span>
                                            <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex items-center justify-between border-b border-gray-200 py-2 dark:border-gray-700">
                                                <span className="text-red-600 dark:text-red-400">Discount</span>
                                                <span className="font-semibold text-red-600 tabular-nums dark:text-red-400">
                                                    -${discount.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        {tax > 0 && (
                                            <div className="flex items-center justify-between border-b border-gray-200 py-2 dark:border-gray-700">
                                                <span className="text-amber-600 dark:text-amber-400">Tax</span>
                                                <span className="font-semibold text-amber-600 tabular-nums dark:text-amber-400">
                                                    ${tax.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between pt-4">
                                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Total Amount</span>
                                            <span className="text-3xl font-black text-green-600 tabular-nums dark:text-green-400">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-6">
                            <Button type="button" variant="outline" onClick={() => window.history.back()} className="gap-2">
                                <XCircle className="h-4 w-4" />
                                Cancel
                            </Button>
                            <div className="flex gap-3">
                                <Button type="button" variant="secondary" className="gap-2">
                                    <Receipt className="h-4 w-4" />
                                    Save Draft
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.client_id || !data.unit_price}
                                    className="min-w-[140px] gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create Invoice'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
