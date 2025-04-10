<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\Role\StoreRoleRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends BaseCrudController
{
    protected string $resource = 'roles';
    protected string $model = Role::class;
    protected string $storeRequestClass = StoreRoleRequest::class;
    protected string $updateRequestClass = StoreRoleRequest::class;

    protected array $withEditRelations = ['permissions'];

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
