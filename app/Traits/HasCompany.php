<?php

namespace App\Traits;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * @method byCompany(int|Company $company)
 */
trait HasCompany
{
    public static function bootHasCompany(): void
    {
        static::addGlobalScope('company', function (Builder $builder) {
            if ($builder->getModel() instanceof User || app()->runningInConsole()) {
                return;
            }
            if (Auth::hasUser() && !Auth::user()->isAdmin()) {
                $builder->where('company_id', Auth::user()->company_id);
            }
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function scopeByCompany(Builder $query, int|Company $company)
    {
        return $query->where('company_id', is_numeric($company) ? $company : $company->id);
    }
}
