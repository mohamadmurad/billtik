<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $main = ['index', 'show', 'update', 'delete'];
        $resources = [
            'users', 'roles', 'companies', 'packages','clients'
        ];

        $extraPermissions = [

        ];
        $overridePermissions = [
            'roles' => ['index', 'update', 'delete'],

        ];

        $permissionsIds = [];
        foreach ($resources as $resource) {
            $setOfPermissions = $main;
            if (isset($overridePermissions[$resource])) {
                $setOfPermissions = $overridePermissions[$resource];
            }
            if (isset($extraPermissions[$resource])) {
                $setOfPermissions = array_merge($setOfPermissions, $extraPermissions[$resource]);
            }
            foreach ($setOfPermissions as $action) {
                $permission = Permission::updateOrCreate([
                    'name' => "$action $resource",
                    'guard_name' => 'web'
                ]);
                $permissionsIds[] = $permission->id;
            }
        }
        Permission::whereNotIn('id', $permissionsIds)->delete();
        $superAdmin = Role::updateOrCreate([
            'name' => 'super admin',
            'guard_name' => 'web',
        ]);
        $superAdmin->givePermissionTo($permissionsIds);

        $baseInfo = [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ];
        $userInfo = array_merge(User::factory()->definition(), $baseInfo);
        User::firstOrCreate($baseInfo, $userInfo)->assignRole($superAdmin);
    }
}
