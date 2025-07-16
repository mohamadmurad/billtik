<?php

namespace App\Policies;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PackagePolicy extends BasePolicy
{
    protected string $resource = 'packages';

}
