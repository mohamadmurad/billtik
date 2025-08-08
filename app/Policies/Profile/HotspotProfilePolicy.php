<?php

namespace App\Policies\Profile;


class HotspotProfilePolicy extends ProfilePolicy
{
    protected string $resource = 'hotspot profiles';
    protected bool $hasCompany = true;

}
