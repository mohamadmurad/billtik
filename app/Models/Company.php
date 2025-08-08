<?php

namespace App\Models;

use App\Models\Client\Client;
use App\Models\Profile\Profile;
use App\Traits\HasAbilities;
use App\Traits\HasTranslatedName;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;
    use HasAbilities, HasTranslatedName;

    protected $fillable = ['name', 'mikrotik_ip', 'mikrotik_username', 'mikrotik_password', 'is_active', 'settings'];

    protected $casts = [
        'name' => 'json',
        'settings' => 'json',
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(CompanySubscription::class);
    }

    public function profiles(): HasMany
    {
        return $this->hasMany(Profile::class);
    }
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
