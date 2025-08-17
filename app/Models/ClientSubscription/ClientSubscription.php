<?php

namespace App\Models\ClientSubscription;

use App\Models\Client\Client;
use App\Models\Profile\Profile;
use App\Policies\ClientSubscription\ClientSubscriptionPolicy;
use App\Traits\HasAbilities;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[UsePolicy(ClientSubscriptionPolicy::class)]
class ClientSubscription extends Model
{
    use SoftDeletes, HasAbilities;

    protected $fillable = [
        'client_id', 'profile_id', 'start_date', 'end_date', 'status',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

}
