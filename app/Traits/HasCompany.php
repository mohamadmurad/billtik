<?php

namespace App\Traits;

use App\Models\Company;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

trait HasCompany
{
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function scopeByCompany(Builder $query, int|Company $company)
    {
        return $query->where('company_id', is_numeric($company) ? $company : $company->id);
    }
}
