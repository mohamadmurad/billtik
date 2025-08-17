<?php

namespace App\Http\Controllers\Company\Subscription;

use App\Http\Controllers\Admin\BaseCrudController;
use App\Models\ClientSubscription\ClientSubscription;

class SubscriptionController extends BaseCrudController
{
    protected string $model = ClientSubscription::class;
    protected array $withIndexRelations = ['client', 'profile'];

    public function filterFields(): array
    {
        return [
            [
                'name' => 'client_id',
            ],
            [
                'name' => 'profile_id',
            ],
            [
                'name' => 'router_id',
                'query' => function ($query, $router_id) {
                    $query->whereHas('client', fn($q) => $q->where('router_id', $router_id))
                        ->whereHas('profile', fn($q) => $q->where('router_id', $router_id));
                }
            ]
        ];
    }
}
