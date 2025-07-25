<?php

namespace App\Models;

use App\Traits\HasAbilities;
use App\Traits\HasCompany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;
    use HasAbilities, HasCompany;

    protected $fillable = [
        'name', 'mikrotik_username', 'mikrotik_password', 'email', 'phone', 'id_number', 'company_id', 'microtik_id'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(ClientSubscription::class);
    }

}
