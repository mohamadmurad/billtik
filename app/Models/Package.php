<?php

namespace App\Models;

use App\Traits\HasAbilities;
use App\Traits\HasTranslatedName;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\ValidationException;

class Package extends Model
{
    use SoftDeletes;
    use HasAbilities, HasTranslatedName;

    protected $fillable = ['name', 'upload_input', 'download_input', 'price'];
    protected $appends = ['price_formatted'];
    protected $casts = [
        'name' => 'json',
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];


    protected static function booted()
    {
        static::saving(function ($package) {
            // Convert inputs to kbps before saving
            $package->upload_kbps = self::convertToKbps('upload_input', $package->upload_input);
            $package->download_kbps = self::convertToKbps('download_input', $package->download_input);
        });
    }


    public function getPriceFormattedAttribute(): string
    {
        return '$' .(int)$this->price ;
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

}
