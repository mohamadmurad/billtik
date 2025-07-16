<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Models\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class CompanyController extends BaseCrudController
{
    protected string $resource = 'companies';
    protected string $model = Company::class;
    protected string $storeRequestClass = StoreCompanyRequest::class;
    protected string $updateRequestClass = StoreCompanyRequest::class;

    protected array $withIndexRelations = [];
    protected array $withShowRelations = ['users'];

    protected function transformBeforeCreate(array $data): array
    {

        unset($data['user']);
        return $data;
    }


    protected function afterStore(Model $model, Request $request): void
    {
        /** @var Company $model */
        $model->users()->create($request->get('user'));
    }

}
