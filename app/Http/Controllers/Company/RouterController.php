<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Admin\BaseCrudController;
use App\Models\Router;

class RouterController extends BaseCrudController
{
    protected string $route = 'routers';
    protected string $resource = 'routers';

    protected string $model = Router::class;


    public function globalQuery($query)
    {
        return $query->byCompany($this->user->company_id);
    }

    public function filterFields(): array
    {
        return [
            [
                'name' => 'name',
                'cond' => 'like',
            ],
            [
                'name' => 'search',
                'cond' => 'like',
                'field' => 'name',
            ]
        ];
    }

    public function formatSearchItem($item): array
    {
        return [
            'label' => $item->name,
            'value' => $item->id,
        ];
    }

}
