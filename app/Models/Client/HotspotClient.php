<?php

namespace App\Models\Client;

use App\Enums\ConnectionTypeEnum;
use App\Policies\Client\HotspotClientPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;


#[UsePolicy(HotspotClientPolicy::class)]
class HotspotClient extends Client
{
    protected string $type = ConnectionTypeEnum::HOTSPOT->value;
    protected $table = 'clients';

    protected static function boot()
    {
        parent::boot();
        parent::addGlobalScope('connection_type',function ($builder){
            $builder->where('connection_type', ConnectionTypeEnum::HOTSPOT->value);
        });
    }
}
