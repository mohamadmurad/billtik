<?php

namespace App\Policies\Client;



class HotspotClientPolicy extends ClientPolicy
{
    protected string $resource = 'hotspot clients';
    protected bool $hasCompany = true;

}
