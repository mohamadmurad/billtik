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

class FrontRouterController extends BaseCrudController
{
    protected string $resource = 'routers';

    protected string $model = Router::class;


    public function globalQuery($query)
    {
        return $query->byCompany($this->user->company_id);
    }

    public function filterFields(): array
    {
        return [
            [
                'name' => 'name',
                'cond' => 'like',
            ],
            [
                'name' => 'search',
                'cond' => 'like',
                'field' => 'name',
            ]
        ];
    }

    public function formatSearchItem($item): array
    {
        return [
            'label' => $item->name,
            'value' => $item->id,
        ];
    }

}
