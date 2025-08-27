<?php

namespace App\Http\Controllers\Company;

use App\Enums\ConnectionTypeEnum;
use App\Enums\InvoiceStatusEnum;
use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Company\Invoice\StoreInvoiceRequest;
use App\Models\Client\Client;
use App\Models\Client\HotspotClient;
use App\Models\Client\PPPClient;
use App\Models\ClientSubscription\ClientSubscription;
use App\Models\Invoice;
use App\Models\Profile\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends BaseCrudController
{
    protected string $route = 'invoices';
    protected string $routePrefix = 'company.';
    protected string $resource = 'invoices';
    protected string $model = Invoice::class;

    protected array $withIndexRelations = ['client', 'items.item.profile'];
    protected array $withShowRelations = ['client', 'items.item'];
    protected string $storeRequestClass = StoreInvoiceRequest::class;


    public function filterFields(): array
    {
        return [
            [
                'name' => 'search',
                'cond' => 'like',
                'field' => 'formated_number',
            ],
            [
                'name' => 'status',
            ],
            [
                'name' => 'client_id',
            ],
            [
                'name' => 'router_id',
                'query' => function ($query, $router_id) {
                    $query->whereHas('client', fn($q) => $q->where('router_id', $router_id));
                }
            ],
        ];
    }

    public function clientDetails(Request $request): array
    {
        $this->authorize('create', $this->model);
        $clientId = (int) $request->get('client_id');
        $clientType = $request->get('client_type'); // 'ppp' | 'hotspot'

        /** @var Client $client */
        $client = match ($clientType) {
            ConnectionTypeEnum::PPP->value, 'ppp' => PPPClient::query()->with('activeSubscription.profile')->findOrFail($clientId),
            ConnectionTypeEnum::HOTSPOT->value, 'hotspot' => HotspotClient::query()->with('activeSubscription.profile')->findOrFail($clientId),
            default => Client::query()->with('activeSubscription.profile')->findOrFail($clientId),
        };

        $activeSubscription = $client->activeSubscription;

        $profiles = Profile::query()
            ->where('company_id', $client->company_id)
            ->where('router_id', $client->router_id)
            ->where('connection_type', $client->connection_type)
            ->get(['id', 'name', 'price']);

        return [
            'active_subscription' => $activeSubscription,
            'profiles' => $profiles,
        ];
    }

    public function clientsSearch(Request $request)
    {
        $this->authorize('create', $this->model);
        $search = (string) $request->get('search', '');
        $routerId = $request->get('router_id');

        $ppp = PPPClient::query()
            ->when($routerId, fn($q) => $q->where('router_id', $routerId))
            ->when($search, fn($q) => $q->where('name', 'like', "%$search%"))
            ->limit(10)
            ->get(['id', 'name', 'mikrotik_username']);

        $hotspot = HotspotClient::query()
            ->when($routerId, fn($q) => $q->where('router_id', $routerId))
            ->when($search, fn($q) => $q->where('name', 'like', "%$search%"))
            ->limit(10)
            ->get(['id', 'name', 'mikrotik_username']);

        $results = [];
        foreach ($ppp as $c) {
            $results[] = [
                'value' => 'ppp:' . $c->id,
                'label' => '[PPP] ' . $c->name . ' (' . $c->mikrotik_username . ')',
            ];
        }
        foreach ($hotspot as $c) {
            $results[] = [
                'value' => 'hotspot:' . $c->id,
                'label' => '[HOTSPOT] ' . $c->name . ' (' . $c->mikrotik_username . ')',
            ];
        }

        return [
            'results' => $results,
            'pagination' => [
                'more' => false,
            ],
        ];
    }

    protected function transformBeforeCreate(array $data): array
    {
        $user = Auth::user();
        return [
            'company_id' => $user->company_id,
            'client_id' => $data['client_id'],
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'],
            'description' => $data['description'] ?? null,
            'status' => InvoiceStatusEnum::UNPAID->value,
            'amount' => 0,
            'tax_amount' => $data['tax_amount'] ?? 0,
            'discount_amount' => $data['discount_amount'] ?? 0,
            'total_amount' => 0,
        ];
    }

    protected function afterStore(\Illuminate\Database\Eloquent\Model $invoice, Request $request): void
    {
        /** @var Invoice $invoice */
        // Only attach pricing info now; do NOT create/modify subscriptions until paid
        $unitPrice = (float) $request->input('unit_price', 0);
        $profileId = $request->input('profile_id');
        $subscriptionId = $request->input('subscription_id');

        if ($subscriptionId) {
            $subscription = ClientSubscription::with('profile')->findOrFail($subscriptionId);
            $invoice->items()->create([
                'item_type' => ClientSubscription::class,
                'item_id' => $subscription->id,
                'quantity' => 1,
                'unit_price' => $unitPrice ?: $subscription->profile->price,
                'amount' => $unitPrice ?: $subscription->profile->price,
                'renewal_start' => $subscription->end_date,
                'renewal_end' => \Illuminate\Support\Carbon::parse($subscription->end_date)->copy()->addMonth()->toDateString(),
            ]);
        } elseif ($profileId) {
            $invoice->items()->create([
                'item_type' => \App\Models\Profile\Profile::class,
                'item_id' => (int) $profileId,
                'quantity' => 1,
                'unit_price' => $unitPrice,
                'amount' => $unitPrice,
                'renewal_start' => now()->toDateString(),
                'renewal_end' => now()->copy()->addMonth()->toDateString(),
            ]);
        }

        $invoice->calcAmount();
    }

    public function pay(Request $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);
        $amount = (float) $request->input('amount');
        $note = $request->input('note');

        $payment = $invoice->payments()->create([
            'amount' => $amount,
            'paid_at' => now(),
            'note' => $note,
        ]);

        // If fully paid, mark invoice paid and handle provisioning
        $paidTotal = $invoice->payments()->sum('amount');
        if ($paidTotal >= $invoice->total_amount) {
            $invoice->update([
                'status' => \App\Enums\InvoiceStatusEnum::PAID->value,
                'paid_at' => now(),
            ]);
            $invoice->refresh();
            $invoice->handle();
        }

        return back()->with('success', __('messages.saved_successfully'));
    }
}

