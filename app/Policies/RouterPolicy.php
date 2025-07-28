<?php

namespace App\Policies;

use App\Models\Router;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RouterPolicy extends BasePolicy
{
    protected string $resource = 'routers';
}
