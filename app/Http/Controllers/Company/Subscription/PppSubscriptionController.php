<?php

namespace App\Http\Controllers\Company\Subscription;

use App\Enums\ConnectionTypeEnum;
use App\Http\Requests\Admin\Client\StoreClientSubscriptionRequest;
use App\Models\Client\PPPClient;
use App\Models\ClientSubscription\PppClientSubscription;
use Illuminate\Http\RedirectResponse;

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

    public function storeForPPP(StoreClientSubscriptionRequest $request, PPPClient $client): RedirectResponse
    {
        return $this->createNew($request, $client, ConnectionTypeEnum::PPP->value);
    }

}
