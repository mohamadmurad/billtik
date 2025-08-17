<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    protected array $main = ['index', 'create', 'show', 'update', 'delete'];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $superAdminPermissionIds = $this->loadSuperAdminPermissions();
        $companyEmployeePermissionIds = $this->loadCompanyEmployeePermissions();

        Permission::whereNotIn('id', array_merge($superAdminPermissionIds, $companyEmployeePermissionIds))->delete();


        $superAdmin = Role::updateOrCreate([
            'name' => 'super admin',
            'guard_name' => 'admin',
        ]);
        $superAdmin->givePermissionTo($superAdminPermissionIds);

        $baseInfo = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'is_admin' => true,
        ];
        $userInfo = array_merge(User::factory()->definition(), $baseInfo);
        User::firstOrCreate($baseInfo, $userInfo)->assignRole($superAdmin);

        $companyAdminRole = Role::updateOrCreate([
            'name' => 'company admin',
            'guard_name' => 'web',
        ]);
        $companyAdminRole->givePermissionTo($companyEmployeePermissionIds);
    }

    protected function loadCompanyEmployeePermissions(): array
    {
        $resources = [
            'ppp profiles', 'ppp clients', 'routers', 'hotspot profiles', 'hotspot clients', 'ppp client subscriptions',
            'hotspot client subscriptions',
        ];
        $extraPermissions = [
            'ppp profiles' => ['sync', 'fetch all'],
            'hotspot profiles' => ['sync', 'fetch all'],
            'ppp clients' => ['sync', 'fetch all', 'enable', 'disable'],
            'hotspot clients' => ['sync', 'fetch all', 'enable', 'disable'],
        ];
        $overridePermissions = [
            'routers' => ['index'],
            'ppp client subscriptions' => ['index'],
            'hotspot client subscriptions' => ['index'],
        ];
        return $this->insertPermissions($resources, $overridePermissions, $extraPermissions);
    }

    protected function loadSuperAdminPermissions(): array
    {
        $resources = [
            'users', 'roles', 'companies', 'routers',
        ];
        $extraPermissions = [];
        $overridePermissions = [
            'roles' => ['index', 'update', 'delete'],
        ];
        return $this->insertPermissions($resources, $overridePermissions, $extraPermissions, 'admin');
    }

    protected function insertPermissions(array $resources, array $overridePermissions, array $extraPermissions, $guard_name = 'web'): array
    {
        $permissionsIds = [];
        foreach ($resources as $resource) {
            $setOfPermissions = $this->main;
            if (isset($overridePermissions[$resource])) {
                $setOfPermissions = $overridePermissions[$resource];
            }
            if (isset($extraPermissions[$resource])) {
                $setOfPermissions = array_merge($setOfPermissions, $extraPermissions[$resource]);
            }
            foreach ($setOfPermissions as $action) {
                $permission = Permission::updateOrCreate([
                    'name' => "$action $resource",
                    'guard_name' => $guard_name
                ]);
                $permissionsIds[] = $permission->id;
            }
        }

        return $permissionsIds;
    }
}
