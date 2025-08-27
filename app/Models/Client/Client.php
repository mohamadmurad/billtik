<?php

namespace App\Models\Client;

use App\Enums\ClientStatusEnum;
use App\Enums\ClientSubscriptionStatusEnum;
use App\Enums\ConnectionTypeEnum;
use App\Models\ClientSubscription\ClientSubscription;
use App\Models\Router;
use App\Observers\ClientObserver;
use App\Services\Mikrotik\BaseMikrotikService;
use App\Services\Mikrotik\Hotspot\MikrotikHotspotClientSerice;
use App\Services\Mikrotik\Ppp\MikrotikPppClientSerice;
use App\Traits\HasAbilities;
use App\Traits\HasCompany;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;


#[ObservedBy(ClientObserver::class)]
class Client extends Model
{
    use SoftDeletes;
    use HasAbilities, HasCompany;

    protected $fillable = [
        'name', 'mikrotik_username', 'mikrotik_password', 'email', 'phone', 'id_number', 'company_id', 'mikrotik_id', 'router_id', 'connection_type',
        'status',
    ];

    protected $appends = ['status_meta'];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function getStatusMetaAttribute()
    {
        return ClientStatusEnum::tryFrom($this->status)?->meta();
    }

    protected function extraAbility(Authenticatable $user): array
    {
        return [
            'need_sync' => $user->can('sync', $this),
            'can_enable' => $user->can('enable', $this),
            'can_disable' => $user->can('disable', $this),
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(ClientSubscription::class, 'client_id', 'id');
    }

    public function router(): BelongsTo
    {
        return $this->belongsTo(Router::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(ClientSubscription::class, 'client_id', 'id')
            ->where('status', ClientSubscriptionStatusEnum::ACTIVE->value)
            ->where(function ($query) {
                $query->whereDate('end_date', '>=', now())
                ->orWhereNull('end_date');
            })
            ->latest();
    }

    public function service(): BaseMikrotikService
    {
        $router = $this->router;
        if (!$router) throw new \Exception('Router not found');
        if ($this->connection_type === ConnectionTypeEnum::HOTSPOT->value) {
            return new MikrotikHotspotClientSerice($router);
        } elseif ($this->connection_type === ConnectionTypeEnum::PPP->value) {
            return new MikrotikPppClientSerice($router);
        }
        throw new \Exception('Unknown connection type');

    }
}
