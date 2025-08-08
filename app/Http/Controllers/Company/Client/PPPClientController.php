<?php

namespace App\Http\Controllers\Company\Client;

use App\Enums\ClientSubscriptionEnumsEnum;
use App\Enums\ConnectionTypeEnum;
use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Admin\Client\StoreClientRequest;
use App\Http\Requests\Admin\Client\UpdateClientRequest;
use App\Models\Client\Client;
use App\Models\Client\PPPClient;
use App\Models\Profile\Profile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class PPPClientController extends BaseCrudController
{
    protected string $route = 'ppp.clients';
    protected string $routePrefix = 'company.';
    protected string $resource = 'ppp/clients';
    protected string $model = PPPClient::class;
    protected string $storeRequestClass = StoreClientRequest::class;
    protected string $updateRequestClass = UpdateClientRequest::class;

    protected array $withIndexRelations = ['router'];
    protected array $withShowRelations = ['router', 'activeSubscription.profile'];

    protected function customIndexQuery(Builder $query): Builder
    {
        return $query->byCompany($this->user->company_id)->latest();
    }

    protected function transformBeforeCreate(array $data): array
    {
        $data['company_id'] = $this->user->company_id;
        $data['connection_type'] = ConnectionTypeEnum::PPP->value;
        return $data;

    }

    protected function afterStore(Model $model, Request $request): void
    {
        try {
            $profile = Profile::where('connection_type', ConnectionTypeEnum::PPP->value)
                ->where('company_id', $this->user->company_id)
                ->where('router_id', $request->get('router_id'))
                ->findOrFail($request->get('profile_id'));
            /** @var PPPClient $model */
//            $model->subscriptions()->create([
//                'profile_id' => $profile->id,
//                'start_date' => today(),
//                'end_date' => today()->addMonth(),
//                'status' => ClientSubscriptionEnumsEnum::ACTIVE->value,
//            ]);

            $service = $model->service();

            $remote_id = $service->createPPPSecert([
                'username' => $model->mikrotik_username,
                'password' => $model->mikrotik_password,
                'profile' => $profile->mikrotik_id,
            ]);
            $model->update([
                'mikrotik_id' => $remote_id,
            ]);
        } catch (\Exception $exception) {

        }
    }

    protected function createExtraData(): array
    {
        return [
            'profiles' => $this->getProfiles(),
        ];
    }

    protected function editExtraData(): array
    {
        return [
            'profiles' => $this->getProfiles(),
        ];
    }

    private function getProfiles()
    {
        return Profile::where('company_id', $this->user->company_id)->get()->map(fn(Profile $profile) => [
            'label' => $profile->local_name,
            'value' => $profile->id,
        ]);
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
