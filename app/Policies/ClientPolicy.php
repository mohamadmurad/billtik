<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ClientPolicy extends BasePolicy
{
    protected string $resource = 'clients';
    protected bool $hasCompany = true;

}
