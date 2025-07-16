<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientSubscription extends Model
{
    use SoftDeletes;

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
