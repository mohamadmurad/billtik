<?php

namespace App\Observers;

use App\Jobs\SendItemToMikrotik;
use App\Models\Client\Client;
use App\Models\Profile\Profile;

class ClientObserver
{
    /**
     * Handle the Profile "created" event.
     */
    public function created(Client $client): void
    {
        dispatch(new SendItemToMikrotik($client));
    }

    /**
     * Handle the Profile "updated" event.
     */
    public function updated(Client $client): void
    {
        dispatch(new SendItemToMikrotik($client, $client->mikrotik_id ? 'update' : 'create'));
    }

    /**
     * Handle the Profile "deleted" event.
     */
    public function deleted(Client $client): void
    {
        //
    }

    /**
     * Handle the Profile "restored" event.
     */
    public function restored(Client $client): void
    {
        //
    }

    /**
     * Handle the Profile "force deleted" event.
     */
    public function forceDeleted(Client $client): void
    {
        //
    }
}
