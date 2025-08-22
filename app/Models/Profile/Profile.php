<?php

namespace App\Models\Profile;

use App\Enums\ConnectionTypeEnum;
use App\Models\Router;
use App\Observers\ProfileObserver;
use App\Services\Mikrotik\BaseMikrotikService;
use App\Services\Mikrotik\Hotspot\MikrotikHotspotProfileSerice;
use App\Services\Mikrotik\Ppp\MikrotikPppProfileSerice;
use App\Services\RateLimitParser;
use App\Traits\HasAbilities;
use App\Traits\HasCompany;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

#[ObservedBy(ProfileObserver::class)]
class Profile extends Model
{
    use SoftDeletes;
    use HasAbilities, HasCompany;

    protected $fillable = ['router_id', 'name', 'upload_input', 'download_input', 'price', 'is_active', 'company_id', 'download_unit', 'upload_unit', 'mikrotik_id', 'connection_type'];
    protected $appends = ['price_formatted', 'download_formatted', 'upload_formatted'];
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'is_active' => 'boolean',
    ];

    public static function createFromMicrotik(Router $router, array $result, int $companyId, string $type): Profile
    {
        $parsedLimit = null;
        if (isset($result['rate-limit'])) {
            $parsedLimit = RateLimitParser::parse($result['rate-limit']);
        }

        $model = static::withoutEvents(function () use ($router, $companyId, $result, $type, $parsedLimit) {
            return static::updateOrCreate([
                'router_id' => $router->id,
                'company_id' => $companyId,
                'name' => $result['name'],
                'connection_type' => $type,
            ], [
                'mikrotik_id' => $result['.id'],
                'upload_input' => $parsedLimit['upload_rate'] ?? null,
                'upload_unit' => $parsedLimit['upload_unit'] ?? null,
                'download_input' => $parsedLimit['download_rate'] ?? null,
                'download_unit' => $parsedLimit['download_unit'] ?? null,
                'price' => 0,
            ]);
        });


        return $model;

    }


    public function getPriceFormattedAttribute(): string
    {
        return '$' . (int)$this->price;
    }

    public static function convertToKbps($key, $input): float|int
    {
        $input = strtolower(trim($input));

        if (preg_match('/^(\d+\.?\d*)([gmk])$/', $input, $matches)) {
            $value = (float)$matches[1];
            $unit = $matches[2];

            return match ($unit) {
                'g' => (int)round($value * 1024 * 1024), // 1G = 1,048,576k
                'm' => (int)round($value * 1024),        // 1M = 1,024k
                'k' => (int)$value,                     // 1K = 1k
                default => throw ValidationException::withMessages([
                    $key => "Invalid speed format: $input"
                ])
            };
        }

        throw ValidationException::withMessages([
            $key => "Invalid speed format: $input"
        ]);
    }

    public function downloadFormatted(): Attribute
    {
        return Attribute::get(function () {
            if ($this->download_input && $this->download_unit) {
                return $this->download_input . '' . strtoupper($this->download_unit);
            }
            return 'unlimited';
        });
    }

    public function uploadFormatted(): Attribute
    {
        return Attribute::get(function () {
            if ($this->upload_input && $this->upload_unit) {
                return $this->upload_input . '' . strtoupper($this->upload_unit);
            }
            return 'unlimited';
        });
    }

    public function getUploadAttribute(): string
    {
        return $this->upload_kbps >= 1024
            ? ($this->upload_kbps / 1024) . 'M'
            : $this->upload_kbps . 'K';
    }

    public function getDownloadAttribute(): string
    {
        return $this->download_kbps >= 1024
            ? ($this->download_kbps / 1024) . 'M'
            : $this->download_kbps . 'K';
    }


    public function syncToServer()
    {
        if ($this->mikrotik_id) return $this->mikrotik_id;
        try {
            $service = $this->service();
            $method = $this->connection_type == ConnectionTypeEnum::PPP->value ? 'createPPPProfile' : 'createHotspotProfile';
            $rateLimit = $this->upload_input . $this->upload_unit . '/' . $this->download_input . $this->download_unit;
            $remoteId = $service->{$method}([
                'name' => $this->name['en'],
                'rate-limit' => $rateLimit,
            ]);

            $this->update([
                'mikrotik_id' => $remoteId,
            ]);
        } catch (\Exception $exception) {
            Log::error('Error in sync profile :' . $this->id . ' ' . $exception->getMessage(), $exception->getTrace());
            throw $exception;
        }
    }

    public function service(): BaseMikrotikService
    {
        $router = $this->router;
        if (!$router) throw new \Exception('Router not found');
        if ($this->connection_type === ConnectionTypeEnum::HOTSPOT->value) {
            return new MikrotikHotspotProfileSerice($router);
        } elseif ($this->connection_type === ConnectionTypeEnum::PPP->value) {
            return new MikrotikPppProfileSerice($router);
        }
        throw new \Exception('Unknown connection type');

    }

    protected function extraAbility(Authenticatable $user): array
    {
        return [
            'need_sync' => $user->can('sync', $this),
            'toggleActive' => $user->can('toggleActive', $this),
        ];
    }

    public function scopeFilter(Builder $query)
    {
        if (request()->filled('search')) {
            $query->where(function ($query) {
                $query->where('name', 'like', '%' . request('search') . '%');
            });
        }
    }

    public function scopeIsSynced(Builder $query): Builder
    {
        return $query->whereNotNull('mikrotik_id');
    }

    public function router(): BelongsTo
    {
        return $this->belongsTo(Router::class);
    }
}
