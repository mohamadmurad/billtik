<?php

namespace App\Http\Controllers\Company\Subscription;

use App\Enums\ConnectionTypeEnum;
use App\Models\ClientSubscription\HotspotClientSubscription;

class HotspotSubscriptionController extends SubscriptionController
{
    protected string $model = HotspotClientSubscription::class;
    protected string $resource = 'hotspot/subscriptions';
    protected string $route = 'company.hotspot.subscriptions';

    public function globalQuery($query)
    {
        return $query->whereHas('client', function ($query) {
            $query->where('connection_type', ConnectionTypeEnum::HOTSPOT->value);
        });
    }
}
