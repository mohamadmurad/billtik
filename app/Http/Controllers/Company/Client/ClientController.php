<?php

namespace App\Http\Controllers\Company\Client;

use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Admin\Client\StoreClientRequest;
use App\Http\Requests\Admin\Client\UpdateClientRequest;

class ClientController extends BaseCrudController
{


    protected array $withIndexRelations = ['router'];
    protected array $withShowRelations = ['router', 'activeSubscription.profile', 'subscriptions.profile', 'subscriptions.client'];

    public function filterFields(): array
    {
        return [
            [
                'name' => 'search',
                'cond' => 'like',
                'field' => 'name',
            ],
            [
                'name' => 'router_id',
            ]
        ];
    }

    public function formatSearchItem($item): array
    {
        return [
            'value' => $item->id,
            'label' => $item->name,
        ];
    }

}
