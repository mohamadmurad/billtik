<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Model;
use function Symfony\Component\String\u;

class BasePolicy
{
    protected string $resource = '';
    protected bool $hasCompany = false;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can("index $this->resource");
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Model $model): bool
    {
        return $user->can("show $this->resource") && $this->checkCompany($user, $model);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can("create $this->resource");
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Model $model): bool
    {
        return $user->can("update $this->resource") && $this->checkCompany($user, $model);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Model $model): bool
    {
        return $user->can("delete $this->resource") && $this->checkCompany($user, $model);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Model $model): bool
    {
        return $user->can("restore $this->resource") && $this->checkCompany($user, $model);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Model $model): bool
    {
        return $user->can("forceDelete $this->resource") && $this->checkCompany($user, $model);
    }

    public function checkCompany(User $user, Model $model): bool
    {
        return ($this->hasCompany && $user->company_id === $model->company_id) || !$this->hasCompany;
    }
}
