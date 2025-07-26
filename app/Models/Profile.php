<?php

namespace App\Models;

use App\Services\MikroTikService;
use App\Services\RateLimitParser;
use App\Traits\HasAbilities;
use App\Traits\HasCompany;
use App\Traits\HasTranslatedName;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class Profile extends Model
{
    use SoftDeletes;
    use HasAbilities, HasTranslatedName, HasCompany;

    protected $fillable = ['name', 'upload_input', 'download_input', 'price', 'is_active', 'company_id', 'download_unit', 'upload_unit', 'microtik_id'];
    protected $appends = ['price_formatted', 'download_formatted', 'upload_formatted'];
    protected $casts = [
        'name' => 'json',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'is_active' => 'boolean',
    ];

    public static function createFromMicrotik(array $result, int $companyId): Profile
    {

        $parsedLimit = RateLimitParser::parse($result['rate-limit']);

        $model = static::updateOrCreate([
            'company_id' => $companyId,
            'microtik_id' => $result['.id'],
        ], [
            'name' => [
                'en' => $result['name'],
                'ar' => $result['name'],
            ],
            'upload_input' => $parsedLimit['upload_rate'],
            'upload_unit' => $parsedLimit['upload_unit'],
            'download_input' => $parsedLimit['download_rate'],
            'download_unit' => $parsedLimit['download_unit'],
            'price' => 0,
        ]);

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
        return Attribute::get(fn() => $this->download_input . '' . strtoupper($this->download_unit));
    }

    public function uploadFormatted(): Attribute
    {
        return Attribute::get(fn() => $this->upload_input . '' . strtoupper($this->upload_unit));
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
        if ($this->microtik_id) return $this->microtik_id;
        try {
            $service = new MikroTikService();
            $rateLimit = $this->upload_input . $this->upload_unit . '/' . $this->download_input . $this->download_unit;
            $remoteId = $service->createPPPProfile([
                'name' => $this->name['en'],
                'rate-limit' => $rateLimit,
            ]);

            $this->update([
                'microtik_id' => $remoteId,
            ]);
        } catch (\Exception $exception) {
            Log::error('Error in sync profile :' . $this->id . ' ' . $exception->getMessage(), $exception->getTrace());
            throw $exception;
        }
    }

    protected function extraAbility(Authenticatable $user): array
    {
        return [
            'need_sync' => $user->can('sync', $this),
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
}
