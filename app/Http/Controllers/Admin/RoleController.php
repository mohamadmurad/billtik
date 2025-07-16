<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Models\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class RoleController extends BaseCrudController
{
    protected string $resource = 'roles';
    protected string $model = Role::class;
    protected string $storeRequestClass = StoreRoleRequest::class;
    protected string $updateRequestClass = StoreRoleRequest::class;

    protected array $withEditRelations = ['permissions'];

    protected function customIndexQuery(Builder $query): Builder
    {
        return $query->whereNotIn('id', [1, 2]);
    }

    protected function createExtraData(): array
    {
        return [
            'permissions' => $this->getGroupedPermissions(),
        ];
    }

    protected function transformBeforeCreate(array $data): array
    {
        $data['guard_name'] = 'web';
        return $data;
    }

    protected function afterStore(Model $model, Request $request): void
    {
        $model->syncPermissions($request->get('permissions'));
    }


    protected function editExtraData(): array
    {
        return [
            'permissions' => $this->getGroupedPermissions(),
        ];
    }

    protected function transformBeforeUpdate(array $data): array
    {
        $data['guard_name'] = 'web';
        return $data;
    }

    protected function afterUpdate(Model $model, Request $request): void
    {
        $model->syncPermissions($request->get('permissions'));
    }


}
