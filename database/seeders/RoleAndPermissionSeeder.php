<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            'users', 'roles'
        ];
        $permissionsIds = [];
        foreach ($resources as $resource) {
            foreach ($main as $action) {
                $permission = Permission::updateOrCreate([
                    'name' => "$action $resource",
                    'guard_name' => 'web'
                ]);
                $permissionsIds[] = $permission->id;
            }
        }
        $superAdmin = Role::updateOrCreate([
            'name' => 'super admin',
            'guard_name' => 'web',
        ]);
        $superAdmin->givePermissionTo($permissionsIds);
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ])->assignRole($superAdmin);
    }
}
