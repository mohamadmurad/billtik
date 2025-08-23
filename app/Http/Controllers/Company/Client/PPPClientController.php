<?php

namespace App\Http\Controllers\Company\Client;

use App\Enums\ClientStatusEnum;
use App\Enums\ConnectionTypeEnum;
use App\Http\Requests\Admin\Client\StoreClientRequest;
use App\Http\Requests\Admin\Client\StorePppClientRequest;
use App\Http\Requests\Admin\Client\UpdateClientRequest;
use App\Http\Requests\Admin\Client\UpdatePppClientRequest;
use App\Jobs\SendItemToMikrotik;
use App\Managers\ClientSubscriptionManager;
use App\Models\Client\PPPClient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class PPPClientController extends ClientController
{
    protected string $route = 'ppp.clients';
    protected string $routePrefix = 'company.';
    protected string $resource = 'ppp/clients';
    protected string $model = PPPClient::class;
    protected string $storeRequestClass = StorePppClientRequest::class;
    protected string $updateRequestClass = UpdatePppClientRequest::class;

    protected array $withIndexRelations = ['router'];
    protected array $withShowRelations = ['router', 'activeSubscription.profile', 'subscriptions.profile', 'subscriptions.client'];

    protected function customIndexQuery(Builder $query): Builder
    {
        return $query->byCompany($this->user->company_id)->latest();
    }

    protected function transformBeforeCreate(array $data): array
    {
        $data['company_id'] = $this->user->company_id;
        $data['connection_type'] = ConnectionTypeEnum::PPP->value;
        $data['status'] = ClientStatusEnum::ACTIVE->value;
        if (App::environment('staging')) {
            $data['mikrotik_id'] = rand(1, 999);
        }
        return $data;

    }

    protected function afterStore(Model $model, Request $request): void
    {
        try {

            ClientSubscriptionManager::make()->create(
                client: $model,
                profile_id: $request->get('profile_id'),
                startDate: today(),
                endDate: today()->addMonth());
        } catch (\Exception $exception) {
            throw $exception;
        }
    }


    public function syncItem(Request $request, PPPClient $client): RedirectResponse
    {
        $this->authorize('sync', $client);
        dispatch(new SendItemToMikrotik($client));
        return redirect()->back()->with('success', __('messages.action_procing_taking_time'));

    }

    public function enable(PPPClient $client): RedirectResponse
    {
        $this->authorize('enable', $client);
        if ($client->mikrotik_id) {
            $client->service()->update($client->mikrotik_id, [
                'disabled' => 'no',
            ]);
            $client->update([
                'status' => ClientStatusEnum::ACTIVE->value,
            ]);
        }
        return back()->with('success', __('messages.saved_successfully'));
    }

    public function disable(PPPClient $client): RedirectResponse
    {
        $this->authorize('disable', $client);
        if ($client->mikrotik_id) {
            $client->service()->update($client->mikrotik_id, [
                'disabled' => 'yes',
            ]);
            $client->update([
                'status' => ClientStatusEnum::DEACTIVATE->value,
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
