<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Http\Requests\Admin\Package\StorePackageRequest;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Models\Client;
use App\Models\Company;
use App\Models\Package;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ClientController extends BaseCrudController
{
    protected string $resource = 'clients';
    protected string $model = Client::class;
    protected string $storeRequestClass = StorePackageRequest::class;
    protected string $updateRequestClass = StorePackageRequest::class;



}
