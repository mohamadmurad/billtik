<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Enums\RolesEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Http\Requests\Admin\Router\StoreRouterRequest;
use App\Http\Requests\Admin\Router\UpdateRouterRequest;
use App\Models\Company;
use App\Models\Role;
use App\Models\Router;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class RouterController extends BaseCrudController
{
    protected string $resource = 'routers';
    protected string $routePrefix = 'admin.';
    protected string $model = Router::class;
    protected string $storeRequestClass = StoreRouterRequest::class;
    protected string $updateRequestClass = UpdateRouterRequest::class;

    protected array $withIndexRelations = ['company'];
    protected array $withShowRelations = ['company'];

}
