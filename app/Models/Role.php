<?php

namespace App\Models;


use App\Traits\HasAbilities;

class Role extends \Spatie\Permission\Models\Role
{
    use HasAbilities;
}
