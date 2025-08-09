<?php

namespace App\Observers;

use App\Jobs\SendItemToMikrotik;
use App\Models\Profile\Profile;

class ProfileObserver
{
    /**
     * Handle the Profile "created" event.
     */
    public function created(Profile $profile): void
    {
        dispatch(new SendItemToMikrotik($profile));
    }

    /**
     * Handle the Profile "updated" event.
     */
    public function updated(Profile $profile): void
    {
        dispatch(new SendItemToMikrotik($profile, $profile->mikrotik_id ? 'update' : 'create'));
    }

    /**
     * Handle the Profile "deleted" event.
     */
    public function deleted(Profile $profile): void
    {
        //
    }

    /**
     * Handle the Profile "restored" event.
     */
    public function restored(Profile $profile): void
    {
        //
    }

    /**
     * Handle the Profile "force deleted" event.
     */
    public function forceDeleted(Profile $profile): void
    {
        //
    }
}
