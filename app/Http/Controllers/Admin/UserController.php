<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\User\StoreUserRequest;
use App\Http\Requests\Admin\User\UpdateUserPermissionsRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\Models\Role;

class UserController extends BaseCrudController
{

    protected string $resource = 'users';
    protected string $route = 'users';
    protected string $model = User::class;
    protected string $storeRequestClass = StoreUserRequest::class;
    protected string $updateRequestClass = UpdateUserRequest::class;
    protected array $withShowRelations = ['roles', 'permissions'];

    protected function showExtraData(Model $model): array
    {
        $roles = Role::all();
        return [
            'roles' => $roles,
            'permissions' => $this->getGroupedPermissions(),
        ];
    }

    protected function transformBeforeUpdate(array $data): array
    {
        if (empty($data['password'])) {
            unset($data['password']);
        }
        return $data;

    }

    /**
     * Update the Permissions resource in storage.
     */
    public function updatePermissions(UpdateUserPermissionsRequest $request, User $user): RedirectResponse
    {
        $user->syncPermissions($request->get('permissions'));
        $user->syncRoles($request->get('roles'));
        $user->refresh();
        return redirect()->route($this->resource . '.show', $user)->with('success', 'Updated successfully.');
    }


}
