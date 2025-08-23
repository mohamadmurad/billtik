<?php

namespace App\Policies\Client;

use App\Enums\ClientStatusEnum;
use App\Models\Client\Client;
use App\Models\User;
use App\Policies\BasePolicy;

class ClientPolicy extends BasePolicy
{
    protected string $resource = 'profiles';
    protected bool $hasCompany = true;


    public function sync(User $user, Client $model): bool
    {
        return is_null($model->mikrotik_id) && $user->can("sync $this->resource");
    }


    public function enable(User $user, Client $model): bool
    {
        return $model->status != ClientStatusEnum::ACTIVE->value
            && (
                $user->can('enable ppp clients')
                || $user->can('enable hotspot clients')
            );
    }

    public function disable(User $user, Client $model): bool
    {
        return $model->status != ClientStatusEnum::DEACTIVATE->value && ($user->can('disable ppp clients') || $user->can('disable hotspot clients'));
    }


    public function fetchAll(User $user)
    {
        return $user->can("fetch all $this->resource");
    }

}
