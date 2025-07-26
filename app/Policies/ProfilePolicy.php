<?php

namespace App\Policies;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Model;

class ProfilePolicy extends BasePolicy
{
    protected string $resource = 'profiles';
    protected bool $hasCompany = true;


    public function sync(User $user, Profile $model)
    {
        return is_null($model->microtik_id) && $user->can("sync $this->resource");
    }


    public function fetchAll(User $user)
    {
        return $user->can("fetch all $this->resource");
    }

}
