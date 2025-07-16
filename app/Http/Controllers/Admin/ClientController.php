<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Client\StoreClientRequest;
use App\Http\Requests\Admin\Client\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Database\Eloquent\Builder;

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


}
