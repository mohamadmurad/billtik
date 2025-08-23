<?php

namespace App\Jobs;

use App\Enums\ClientSubscriptionStatusEnum;
use App\Models\Client\Client;
use App\Models\Profile\Profile;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendItemToMikrotik implements ShouldQueue, ShouldBeUnique
{
    use Queueable;


    /**
     * Create a new job instance.
     */
    public function __construct(protected Profile|Client $item, protected string $action = 'create')
    {
        //
    }

    public function uniqueId(): string
    {
        return $this->item::class . '_' . $this->item->id;
    }

    /**
     * Execute the job.
     * @throws \Exception
     */
    public function handle(): void
    {
        try {
            if ($this->item instanceof Profile) {
                $this->handelProfile();
            }
            if ($this->item instanceof Client) {
                $this->handelClient();
            }

        } catch (\Exception $exception) {
            logger()->error('SendItemToMikrotik failed: ' . $exception->getMessage(), [
                'exception' => $exception,
                'item_id' => $this->item->id,
                'item_type' => get_class($this->item),
                'action' => $this->action
            ]);

            // Exponential backoff for retries
            $this->release(now()->addMinutes(min(5 * $this->attempts(), 30)));
        }

    }

    protected function handelProfile(): void
    {
        $service = $this->item->service();
        $rateLimit = $this->item->upload_input . $this->item->upload_unit . '/' . $this->item->download_input . $this->item->download_unit;
        if ($this->action == 'create') {
            $remoteId = $service->create([
                'name' => $this->item->name,
                'rate-limit' => $rateLimit,
            ]);
            $this->item->updateQuietly([
                'mikrotik_id' => $remoteId,
            ]);
        } elseif ($this->action == 'update') {
            if (empty($this->item->mikrotik_id)) {
                throw new \RuntimeException('Cannot update profile: mikrotik_id is missing');
            }
            $service->update($this->item->mikrotik_id, [
                'name' => $this->item->name,
                'rate-limit' => $rateLimit,
            ]);
        }
    }

    private function handelClient(): void
    {
        $service = $this->item->service();
        if ($this->action == 'create') {
            $subscription = $this->item->subscriptions()
                ->where('status', ClientSubscriptionStatusEnum::PENDING->value)
                ->first();
            if (!$subscription) {
                $subscription = $this->item->subscriptions()
                    ->where('status', ClientSubscriptionStatusEnum::ACTIVE->value)
                    ->first();
            }
            $remoteId = $service->create([
                'username' => $this->item->mikrotik_username,
                'password' => $this->item->mikrotik_password,
                'profile' => $subscription?->profile?->mikrotik_id,
            ]);
            $this->item->updateQuietly([
                'mikrotik_id' => $remoteId,
            ]);
            $subscription->update([
                'status' => ClientSubscriptionStatusEnum::ACTIVE->value,
            ]);
        } elseif ($this->action == 'update') {
            if (empty($this->item->mikrotik_id)) {
                throw new \RuntimeException('Cannot update profile: mikrotik_id is missing');
            }
            $payload = [
                'username' => $this->item->mikrotik_username,
                'password' => $this->item->mikrotik_password,
            ];
            $active = $this->item->activeSubscription()->first();
            if ($active && $active->profile?->mikrotik_id) {
                $payload['profile'] = $active->profile->mikrotik_id;
            }
            $service->update($this->item->mikrotik_id, $payload);
        }
    }

}
