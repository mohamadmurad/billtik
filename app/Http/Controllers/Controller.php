<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;

abstract class Controller
{
    protected function getGroupedPermissions()
    {
        $permissions = Permission::all();


        return $permissions->mapToGroups(function ($permission) {
            $parts = explode(' ', $permission->name, 2); // Split action and entity
            return [
                ucfirst($parts[1] ?? 'Others') => [  // Capitalize entity name (Users, Roles)
                    'id' => $permission->id,
                    'name' => $parts[0] // Action name (index, show, delete)
                ]
            ];
        });
    }
}
