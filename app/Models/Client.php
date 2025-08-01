<?php

namespace App\Models;

use App\Enums\ClientSubscriptionEnumsEnum;
use App\Traits\HasAbilities;
use App\Traits\HasCompany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;
    use HasAbilities, HasCompany;

    protected $fillable = [
        'name', 'mikrotik_username', 'mikrotik_password', 'email', 'phone', 'id_number', 'company_id', 'microtik_id', 'router_id'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(ClientSubscription::class);
    }

    public function router(): BelongsTo
    {
        return $this->belongsTo(Router::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(ClientSubscription::class)->where('status', ClientSubscriptionEnumsEnum::ACTIVE->value)->latest();
    }
}
