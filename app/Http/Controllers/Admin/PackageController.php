<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Http\Requests\Admin\Package\StorePackageRequest;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Models\Company;
use App\Models\Profile;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class PackageController extends BaseCrudController
{
    protected string $resource = 'packages';
    protected string $model = Profile::class;
    protected string $storeRequestClass = StorePackageRequest::class;
    protected string $updateRequestClass = StorePackageRequest::class;



}
