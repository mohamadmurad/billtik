<?php

namespace App\Policies;

use App\Models\User;

class ClientSubscriptionPolicy extends BasePolicy
{
    protected string $resource = 'subscriptions';
    protected bool $hasCompany = true;

    public function index(User $user): bool
    {
        return $user->can('index ' . $this->resource);
    }
}
