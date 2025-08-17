<?php

namespace App\Models\ClientSubscription;

use App\Policies\ClientSubscription\PppClientSubscriptionPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;

#[UsePolicy(PppClientSubscriptionPolicy::class)]
class PppClientSubscription extends ClientSubscription
{
    protected $table = 'client_subscriptions';
}
