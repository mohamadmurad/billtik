<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Client\StoreClientRequest;
use App\Http\Requests\Admin\Client\UpdateClientRequest;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Http\Requests\Admin\Package\StorePackageRequest;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Models\Client;
use App\Models\Company;
use App\Models\Profile;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ClientController extends BaseCrudController
{
    protected string $resource = 'clients';
    protected string $model = Client::class;
    protected string $storeRequestClass = StoreClientRequest::class;
    protected string $updateRequestClass = UpdateClientRequest::class;



}
