<?php

namespace App\Policies\Client;

use App\Models\Client\Client;
use App\Models\Profile\Profile;
use App\Models\User;
use App\Policies\BasePolicy;

class ClientPolicy extends BasePolicy
{
    protected string $resource = 'profiles';
    protected bool $hasCompany = true;


    public function sync(User $user, Client $model)
    {
        return is_null($model->mikrotik_id) && $user->can("sync $this->resource");
    }


    public function fetchAll(User $user)
    {
        return $user->can("fetch all $this->resource");
    }

}
