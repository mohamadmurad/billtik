<?php

namespace App\Policies\Client;

use App\Policies\BasePolicy;

class PPPClientPolicy extends ClientPolicy
{
    protected string $resource = 'ppp clients';
    protected bool $hasCompany = true;

}
