<?php

namespace App\Http\Controllers\Company\Subscription;

use App\Enums\ClientSubscriptionEnumsEnum;
use App\Enums\ConnectionTypeEnum;
use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Admin\Client\StoreClientSubscriptionRequest;
use App\Jobs\SendItemToMikrotik;
use App\Models\Client\Client;
use App\Models\ClientSubscription\ClientSubscription;
use App\Models\Profile\Profile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends BaseCrudController
{
    protected string $model = ClientSubscription::class;
    protected array $withIndexRelations = ['client', 'profile'];

    protected function createNew(StoreClientSubscriptionRequest $request, Client $client, string $connectionType): RedirectResponse
    {
        $this->authorize('updateSubscription', $client);

        $profile = Profile::query()
            ->where('connection_type', $connectionType)
            ->where('company_id', $request->user()->company_id)
            ->where('router_id', $client->router_id)
            ->findOrFail($request->input('profile_id'));

        $start = $request->date('start_date')->toDateString();
        $end = $request->input('end_date');
        $today = now()->toDateString();

        $status = ClientSubscriptionEnumsEnum::PENDING->value;
        if ($start <= $today && (is_null($end) || $end >= $today)) {
            $status = ClientSubscriptionEnumsEnum::ACTIVE->value;
        } elseif (!is_null($end) && $end < $today) {
            $status = ClientSubscriptionEnumsEnum::EXPIRED->value;
        }

        DB::transaction(function () use ($client, $profile, $start, $end, $status, $connectionType) {
            if ($status === ClientSubscriptionEnumsEnum::ACTIVE->value) {
                $client->subscriptions()
                    ->where('status', ClientSubscriptionEnumsEnum::ACTIVE->value)
                    ->update(['status' => ClientSubscriptionEnumsEnum::EXPIRED->value]);
            }

            $subscription = $client->subscriptions()->create([
                'profile_id' => $profile->id,
                'start_date' => $start,
                'end_date' => $end,
                'status' => $status,
            ]);

            if ($status === ClientSubscriptionEnumsEnum::ACTIVE->value) {
                if ($client->mikrotik_id) {
                    try {
                        $params = [
                            'profile' => $profile->mikrotik_id,
                        ];
                        if ($connectionType === ConnectionTypeEnum::HOTSPOT->value) {
                            $params['disabled'] = false;
                        } else {
                            $params['disabled'] = 'no';
                        }
                        $client->service()->update($client->mikrotik_id, $params);
                    } catch (\Throwable $e) {
                        dispatch(new SendItemToMikrotik($client, 'update'));
                    }
                } else {
                    dispatch(new SendItemToMikrotik($client));
                }
            }
        });

        return redirect()->back()->with('success', __('messages.saved_successfully'));
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
