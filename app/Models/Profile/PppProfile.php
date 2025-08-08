<?php

namespace App\Models\Profile;

use App\Enums\ConnectionTypeEnum;
use App\Policies\Profile\PPPProfilePolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;

#[UsePolicy(PPPProfilePolicy::class)]
class PppProfile extends Profile
{
    protected string $type = ConnectionTypeEnum::PPP->value;
    protected $table = 'profiles';
    protected static function boot()
    {
        parent::boot();
        parent::addGlobalScope('connection_type',function ($builder){
            $builder->where('connection_type', ConnectionTypeEnum::PPP->value);
        });
    }
}
