<?php

namespace App\Models\Profile;

use App\Enums\ConnectionTypeEnum;
use App\Policies\Profile\HotspotProfilePolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use function Termwind\parse;

#[UsePolicy(HotspotProfilePolicy::class)]
class HotspotProfile extends Profile
{
    protected string $type = ConnectionTypeEnum::HOTSPOT->value;
    protected $table = 'profiles';

    protected static function boot()
    {
        parent::boot();
        parent::addGlobalScope('connection_type',function ($builder){
            $builder->where('connection_type', ConnectionTypeEnum::HOTSPOT->value);
        });
    }
}
