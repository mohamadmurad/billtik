<?php

namespace App\Policies;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProfilePolicy extends BasePolicy
{
    protected string $resource = 'profiles';
    protected bool $hasCompany = true;

}
