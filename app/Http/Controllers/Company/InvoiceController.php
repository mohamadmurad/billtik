<?php

namespace App\Http\Controllers\Company;

use App\Enums\ConnectionTypeEnum;
use App\Enums\InvoiceStatusEnum;
use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Company\Invoice\StoreInvoiceRequest;
use App\Managers\ClientSubscriptionManager;
use App\Models\Client\Client;
use App\Models\Client\HotspotClient;
use App\Models\Client\PPPClient;
use App\Models\ClientSubscription\ClientSubscription;
use App\Models\Invoice;
use App\Models\Profile\Profile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends BaseCrudController
{
    protected string $route = 'invoices';
    protected string $routePrefix = 'company.';
    protected string $resource = 'invoices';
    protected string $model = Invoice::class;

    protected array $withIndexRelations = ['client'];
    protected array $withShowRelations = ['client', 'items.item'];
    protected string $storeRequestClass = StoreInvoiceRequest::class;

    public function index(): Response
    {
        $this->authorize('viewAny', $this->model);
        $query = $this->createQuery();
        $query->with($this->withIndexRelations ?? []);
        return Inertia::render("admin/$this->resource/index", [
            'items' => $query->paginate(),
        ]);
    }

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

    protected function customIndexQuery(Builder $query): Builder
    {
        return $query->byCompany(Auth::user()->company_id)->latest();
    }

    protected function createExtraData(): array
    {
        return [
            'statuses' => collect(InvoiceStatusEnum::cases())->map(fn($e) => ['value' => $e->value, 'label' => $e->name])->values(),
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
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => 0,
        ];
    }

    protected function afterStore(\Illuminate\Database\Eloquent\Model $invoice, Request $request): void
    {
        /** @var Invoice $invoice */
        $client = Client::findOrFail($request->integer('client_id'));
        $subscriptionId = $request->input('subscription_id');

        if (!$subscriptionId) {
            // Create new subscription using selected profile
            $profileId = (int) $request->input('profile_id');
            $start = now()->toDateString();
            $end = now()->copy()->addMonth()->toDateString();
            ClientSubscriptionManager::make()->create(
                client: $client,
                profile_id: $profileId,
                startDate: $start,
                endDate: $end,
            );
            // Fetch the latest created subscription for the client
            $subscription = $client->subscriptions()->latest('id')->with('profile')->firstOrFail();
        } else {
            $subscription = ClientSubscription::with('profile')->findOrFail($subscriptionId);
        }

        $renewalStart = $subscriptionId ? \Illuminate\Support\Carbon::parse($subscription->end_date)->toDateString() : $subscription->start_date;
        $renewalEnd = $subscriptionId
            ? \Illuminate\Support\Carbon::parse($subscription->end_date)->copy()->addMonth()->toDateString()
            : $subscription->end_date;

        $invoice->items()->create([
            'item_type' => ClientSubscription::class,
            'item_id' => $subscription->id,
            'quantity' => 1,
            'unit_price' => $subscription->profile->price,
            'amount' => $subscription->profile->price,
            'renewal_start' => $renewalStart,
            'renewal_end' => $renewalEnd,
        ]);

        $invoice->calcAmount();
    }
}

