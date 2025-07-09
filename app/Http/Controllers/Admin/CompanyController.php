<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Models\Company;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class CompanyController extends BaseCrudController
{
    protected string $resource = 'companies';
    protected string $model = Company::class;
    protected string $storeRequestClass = StoreCompanyRequest::class;
    protected string $updateRequestClass = StoreCompanyRequest::class;


    protected function transformBeforeCreate(array $data): array
    {
        $data['status'] = CompanyStatusEnum::TRIAL->value;
        return $data;
    }


}
