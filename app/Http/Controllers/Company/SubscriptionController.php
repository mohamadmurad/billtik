<?php

namespace App\Http\Controllers\Company;

use App\Enums\ClientSubscriptionEnumsEnum;
use App\Http\Controllers\Controller;
use App\Models\ClientSubscription;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $subscriptions = ClientSubscription::query()
            ->with(['client.router', 'profile'])
            ->whereHas('client', fn(Builder $q) => $q->byCompany($request->user()->company_id))
            ->when($request->filled('router_id'), function (Builder $q) use ($request) {
                $q->whereHas('client', function (Builder $qq) use ($request) {
                    $qq->where('router_id', $request->integer('router_id'));
                });
            })
            ->when($request->filled('profile_id'), fn(Builder $q) => $q->where('profile_id', $request->integer('profile_id')))
            ->when($request->filled('client_id'), fn(Builder $q) => $q->where('client_id', $request->integer('client_id')))
            ->when($request->filled('status'), fn(Builder $q) => $q->where('status', $request->string('status')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/client-subscriptions/index', [
            'items' => $subscriptions,
            'filters' => [
                'router_id' => $request->input('router_id'),
                'profile_id' => $request->input('profile_id'),
                'client_id' => $request->input('client_id'),
                'status' => $request->input('status'),
            ],
            'statuses' => [
                ClientSubscriptionEnumsEnum::PENDING->value,
                ClientSubscriptionEnumsEnum::ACTIVE->value,
                ClientSubscriptionEnumsEnum::EXPIRED->value,
            ],
        ]);
    }

    public function update(Request $request, ClientSubscription $subscription): RedirectResponse
    {
        $this->authorize('update', $subscription);
        $validated = $request->validate([
            'end_date' => ['nullable', 'date', 'after_or_equal:' . $subscription->start_date],
        ]);
        $subscription->update($validated);
        return back()->with('success', __('messages.saved_successfully'));
    }
}