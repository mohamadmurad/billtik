<?php

namespace App\Policies;

use App\Models\User;
use Faker\Provider\Base;
use Illuminate\Auth\Access\Response;

class UserPolicy extends BasePolicy
{
    protected string $resource = 'users';

}
