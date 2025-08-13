<?php

namespace App\Http\Controllers\Company\Client;

use App\Enums\ClientSubscriptionEnumsEnum;
use App\Enums\ConnectionTypeEnum;
use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Admin\Client\StoreClientRequest;
use App\Http\Requests\Admin\Client\StoreHotspotClientRequest;
use App\Http\Requests\Admin\Client\UpdateClientRequest;
use App\Http\Requests\Admin\Client\UpdateHotspotClientRequest;
use App\Jobs\SendItemToMikrotik;
use App\Models\Client\HotspotClient;
use App\Models\Client\PPPClient;
use App\Models\Profile\Profile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class HotspotClientController extends BaseCrudController
{
    protected string $route = 'hotspot.clients';
    protected string $routePrefix = 'company.';
    protected string $resource = 'hotspot/clients';
    protected string $model = HotspotClient::class;
    protected string $storeRequestClass = StoreHotspotClientRequest::class;
    protected string $updateRequestClass = UpdateHotspotClientRequest::class;

    protected array $withIndexRelations = ['router'];
    protected array $withShowRelations = ['router', 'activeSubscription.profile', 'subscriptions.profile'];

    protected function customIndexQuery(Builder $query): Builder
    {
        return $query->byCompany($this->user->company_id)->latest();
    }

    protected function transformBeforeCreate(array $data): array
    {
        $data['company_id'] = $this->user->company_id;
        $data['connection_type'] = ConnectionTypeEnum::HOTSPOT->value;
        return $data;

    }

    protected function afterStore(Model $model, Request $request): void
    {
        try {
            $profile = Profile::where('connection_type', ConnectionTypeEnum::HOTSPOT->value)
                ->where('company_id', $this->user->company_id)
                ->where('router_id', $request->get('router_id'))
                ->findOrFail($request->get('profile_id'));
            /** @var PPPClient $model */
            $subscription = $model->subscriptions()->create([
                'profile_id' => $profile->id,
                'start_date' => today(),
                'end_date' => today()->addMonth(),
                'status' => ClientSubscriptionEnumsEnum::PENDING->value,
            ]);


        } catch (\Exception $exception) {
            throw $exception;
        }
    }

    public function syncItem(Request $request, HotspotClient $client): RedirectResponse
    {
        $this->authorize('sync', $client);
        dispatch(new SendItemToMikrotik($client));
        return redirect()->back()->with('success', __('messages.action_procing_taking_time'));

    }

    public function enable(HotspotClient $client): RedirectResponse
    {
        $this->authorize('enable', $client);
        if ($client->mikrotik_id) {
            $client->service()->update($client->mikrotik_id, [
                'disabled' => false,
            ]);
        }
        return back()->with('success', __('messages.saved_successfully'));
    }

    public function disable(HotspotClient $client): RedirectResponse
    {
        $this->authorize('disable', $client);
        if ($client->mikrotik_id) {
            $client->service()->update($client->mikrotik_id, [
                'disabled' => true,
            ]);
        }
        return back()->with('success', __('messages.saved_successfully'));
    }


    public function filterFields(): array
    {
        return [
            [
                'name' => 'search',
                'cond' => 'like',
                'field' => 'name',
            ],
            [
                'name' => 'router_id',
            ]
        ];
    }

}
