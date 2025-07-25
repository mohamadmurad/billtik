<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Http\Requests\Admin\Profile\StoreProfileRequest;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Models\Company;
use App\Models\Profile;
use App\Models\Role;
use App\Services\MikroTikService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ProfileController extends BaseCrudController
{
    protected string $resource = 'profiles';
    protected string $model = Profile::class;
    protected string $storeRequestClass = StoreProfileRequest::class;
    protected string $updateRequestClass = StoreProfileRequest::class;


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
        $service = new MikroTikService();
        $rateLimit = $model->upload_input . $model->upload_unit . '/' . $model->download_input . $model->download_unit;
        $remoteId = $service->createPPPProfile([
            'name' => $model->name['en'],
            'rate-limit' => $rateLimit,
        ]);
        $model->update([
            'microtik_id' => $remoteId,
        ]);

    }

    protected function afterUpdate(Model $model, Request $request): void
    {
        $service = new MikroTikService();
        $rateLimit = $model->upload_input . $model->upload_unit . '/' . $model->download_input . $model->download_unit;
        $remoteId = $service->updatePPPProfile('3434', [
            'name' => $model->name['en'],
            'rate-limit' => $rateLimit,
        ]);
    }


}
