<?php

namespace App\Jobs;

use App\Enums\ClientSubscriptionStatusEnum;
use App\Models\ClientSubscription\ClientSubscription;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DisableEndedClientSubscriptionJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     * @throws Exception
     */
    public function handle(): void
    {
        ClientSubscription::query()
            ->where('status', ClientSubscriptionStatusEnum::ACTIVE->value)
            ->whereDate('end_date', '<', today())->chunk(500, function ($subscriptions) {
                foreach ($subscriptions as $subscription) {
                    /** @var ClientSubscription $subscription */
                    $subscription->stop();
                }
            });

    }
}
