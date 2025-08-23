<?php

namespace App\Policies\Client;

use App\Models\Client\PPPClient;
use App\Models\User;

class PPPClientPolicy extends ClientPolicy
{
    protected string $resource = 'ppp clients';
    protected bool $hasCompany = true;
    public function updateSubscription(User $user, PPPClient $model): bool
    {
        return !is_null($model->mikrotik_id) && $user->can("update subscription $this->resource");
    }
}
