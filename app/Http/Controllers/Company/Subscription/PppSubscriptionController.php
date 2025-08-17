<?php

namespace App\Http\Controllers\Company\Subscription;

use App\Enums\ConnectionTypeEnum;
use App\Models\ClientSubscription\PppClientSubscription;

class PppSubscriptionController extends SubscriptionController
{
    protected string $model = PppClientSubscription::class;
    protected string $resource = 'ppp/subscriptions';
    protected string $route = 'company.ppp.subscriptions';

    public function globalQuery($query)
    {
        return $query->whereHas('client', function ($query) {
            $query->where('connection_type', ConnectionTypeEnum::PPP->value);
        });
    }

}
