<?php

namespace App\Http\Controllers\Company\Subscription;

use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Admin\Client\StoreClientSubscriptionRequest;
use App\Managers\ClientSubscriptionManager;
use App\Models\Client\HotspotClient;
use App\Models\Client\PPPClient;
use App\Models\ClientSubscription\ClientSubscription;
use Illuminate\Http\RedirectResponse;

class SubscriptionController extends BaseCrudController
{
    protected string $model = ClientSubscription::class;
    protected array $withIndexRelations = ['client', 'profile'];

    protected function createNew(StoreClientSubscriptionRequest $request, HotspotClient|PPPClient $client, string $connectionType): RedirectResponse
    {
        $this->authorize('updateSubscription', $client);
        try {
            ClientSubscriptionManager::make()->create(
                client: $client,
                profile_id: $request->get('profile_id'),
                startDate: $request->date('start_date'),
                endDate: $request->input('end_date'));
            return redirect()->back()->with('success', __('messages.saved_successfully'));
        } catch (\Exception $exception) {
            logger()->error($exception->getMessage());
            return redirect()->back()->with('error', $exception->getMessage());
        }

    }

    public function filterFields(): array
    {
        return [
            [
                'name' => 'client_id',
            ],
            [
                'name' => 'profile_id',
            ],
            [
                'name' => 'router_id',
                'query' => function ($query, $router_id) {
                    $query->whereHas('client', fn($q) => $q->where('router_id', $router_id))
                        ->whereHas('profile', fn($q) => $q->where('router_id', $router_id));
                }
            ]
        ];
    }
}
