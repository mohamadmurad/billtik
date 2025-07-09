<?php

namespace App\Traits;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;

trait HasAbilities
{
    public function getAbilitiesAttribute(): array
    {
        /** @var   Authenticatable $user */
        $user = Auth::user();

        return array_merge([
            'view' => $user->can('view', $this),
            'edit' => $user->can('update', $this),
            'delete' => $user->can('delete', $this),
            // Add more abilities as needed
        ], $this->extraAbility($user));
    }

    protected function extraAbility(Authenticatable $user): array
    {
        return [];
    }

    protected function initializeHasAbilities(): void
    {
        $this->append('abilities');
    }
}
