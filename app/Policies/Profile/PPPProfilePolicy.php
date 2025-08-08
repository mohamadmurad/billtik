<?php

namespace App\Policies\Profile;


class PPPProfilePolicy extends ProfilePolicy
{
    protected string $resource = 'ppp profiles';
    protected bool $hasCompany = true;

}
