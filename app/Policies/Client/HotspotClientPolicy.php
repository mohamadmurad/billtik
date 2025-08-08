<?php

namespace App\Policies\Client;

use App\Policies\BasePolicy;

class HotspotClientPolicy extends BasePolicy
{
    protected string $resource = 'hotspot clients';
    protected bool $hasCompany = true;

}
