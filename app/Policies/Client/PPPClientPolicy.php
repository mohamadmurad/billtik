<?php

namespace App\Policies\Client;

use App\Policies\BasePolicy;

class PPPClientPolicy extends BasePolicy
{
    protected string $resource = 'ppp clients';
    protected bool $hasCompany = true;

}
