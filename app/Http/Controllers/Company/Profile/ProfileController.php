<?php

namespace App\Http\Controllers\Company\Profile;

use App\Http\Controllers\Admin\BaseCrudController;

class ProfileController extends BaseCrudController
{

    protected array $withShowRelations = ['router'];
    protected array $withIndexRelations = ['router'];


    public function filterFields(): array
    {
        return [
            [
                'name' => 'router_id',
            ], [
                'name' => 'search',
                'cond' => 'like',
                'field' => 'name',
            ],
            [
                'name' => 'is_synced',
                'query' => fn($query) => $query->isSynced(),
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
