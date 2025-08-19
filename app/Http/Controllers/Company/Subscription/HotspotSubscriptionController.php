<?php

namespace App\Http\Controllers\Company\Subscription;

use App\Enums\ConnectionTypeEnum;
use App\Http\Requests\Admin\Client\StoreClientSubscriptionRequest;
use App\Models\Client\HotspotClient;
use App\Models\ClientSubscription\HotspotClientSubscription;
use Illuminate\Http\RedirectResponse;

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

    public function storeForHotspot(StoreClientSubscriptionRequest $request, HotspotClient $client): RedirectResponse
    {
        return $this->createNew($request, $client, ConnectionTypeEnum::HOTSPOT->value);
    }
}
