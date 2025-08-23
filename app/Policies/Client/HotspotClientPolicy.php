<?php

namespace App\Policies\Client;



use App\Models\Client\HotspotClient;
use App\Models\User;

class HotspotClientPolicy extends ClientPolicy
{
    protected string $resource = 'hotspot clients';
    protected bool $hasCompany = true;
    public function updateSubscription(User $user, HotspotClient $model): bool
    {
        return !is_null($model->mikrotik_id) && $user->can("update subscription $this->resource");
    }
}
