<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Enums\RolesEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Models\Company;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class CompanyController extends BaseCrudController
{
    protected string $route = 'companies';
    protected string $resource = 'companies';
    protected string $routePrefix = 'admin.';
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

    protected function customIndexQuery(Builder $query): Builder
    {
        return $query->when(\request()->get('search'), fn ($query, $search) => $query->where('name', 'like', '%' . $search . '%'));
    }

    protected function afterStore(Model $model, Request $request): void
    {
        /** @var Company $model */
        /** @var User $user */
        $user = $model->users()->create($request->get('user'));
        $role = Role::where('guard_name', 'web')->where('name', RolesEnum::COMPANY_ADMIN)->firstOrFail();
        $user->assignRole($role);
    }

    public function formatSearchItem($item): array
    {
        return [
            'value' => $item->id,
            'label' => $item->local_name,
        ];
    }
}
