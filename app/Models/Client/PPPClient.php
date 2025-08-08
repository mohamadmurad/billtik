<?php

namespace App\Models\Client;

use App\Enums\ConnectionTypeEnum;
use App\Policies\Client\PPPClientPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;


#[UsePolicy(PPPClientPolicy::class)]
class PPPClient extends Client
{
    protected string $type = ConnectionTypeEnum::PPP->value;
    protected $table = 'clients';

    protected static function boot()
    {
        parent::boot();
        parent::addGlobalScope('connection_type',function ($builder){
            $builder->where('connection_type', ConnectionTypeEnum::PPP->value);
        });
    }
}
