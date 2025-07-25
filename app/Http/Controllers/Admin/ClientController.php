<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ClientSubscriptionEnumsEnum;
use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Client\StoreClientRequest;
use App\Http\Requests\Admin\Client\UpdateClientRequest;
use App\Models\Client;
use App\Models\Profile;
use App\Services\MikroTikService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ClientController extends BaseCrudController
{
    protected string $resource = 'clients';
    protected string $model = Client::class;
    protected string $storeRequestClass = StoreClientRequest::class;
    protected string $updateRequestClass = UpdateClientRequest::class;

    protected function customIndexQuery(Builder $query): Builder
    {
        return $query->byCompany($this->user->company_id);
    }

    protected function transformBeforeCreate(array $data): array
    {
        $data['company_id'] = $this->user->company_id;
        return $data;

    }

    protected function afterStore(Model $model, Request $request): void
    {
        try {
            /** @var Client $model */
            $model->subscriptions()->create([
                'profile_id' => $request->get('profile_id'),
                'start_date' => today(),
                'end_date' => today()->addMonth(),
                'status' => ClientSubscriptionEnumsEnum::ACTIVE->value,
            ]);

            $service = new MikroTikService();
            $profile = Profile::findOrFail($request->get('profile_id'));
            $remote_id = $service->createPPPSecert([
                'username' => $model->mikrotik_username,
                'password' => $model->mikrotik_password,
                'profile' => $profile->microtik_id,
            ]);
            $model->update([
                'microtik_id' => $remote_id,
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


}
