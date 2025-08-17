<?php

namespace App\Models\ClientSubscription;

use App\Policies\ClientSubscription\HotspotClientSubscriptionPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;

#[UsePolicy(HotspotClientSubscriptionPolicy::class)]
class HotspotClientSubscription extends ClientSubscription
{
    protected $table = 'client_subscriptions';

}
