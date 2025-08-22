<?php

namespace App\Policies\Profile;

use App\Models\Profile\Profile;
use App\Models\User;
use App\Policies\BasePolicy;

class ProfilePolicy extends BasePolicy
{
    protected string $resource = 'profiles';
    protected bool $hasCompany = true;


    public function sync(User $user, Profile $model)
    {
        return is_null($model->mikrotik_id) && $user->can("sync $this->resource");
    }


    public function fetchAll(User $user)
    {
        return $user->can("fetch all $this->resource");
    }

    public function toggleActive(User $user, Profile $model): bool
    {
        return $user->can("toggle active $this->resource") && $this->checkCompany($user, $model);
    }

}
