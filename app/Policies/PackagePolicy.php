<?php

namespace App\Policies;

use App\Models\Package;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PackagePolicy extends BasePolicy
{
    protected string $resource = 'packages';

}
