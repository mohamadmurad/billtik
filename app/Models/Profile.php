<?php

namespace App\Models;

use App\Traits\HasAbilities;
use App\Traits\HasCompany;
use App\Traits\HasTranslatedName;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
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


}
