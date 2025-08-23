<?php

namespace App\Console\Commands;

use App\Enums\ClientSubscriptionStatusEnum;
use App\Models\Client\Client;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckSubscriptionsCommand extends Command
{
    protected $signature = 'subscriptions:check';

    protected $description = 'Activate due subscriptions and disable clients whose subscriptions have expired';

    public function handle(): int
    {
        $today = now()->toDateString();

        // Disable clients with expired active subscriptions
        $expiredCount = 0;
        Client::query()
            ->with(['activeSubscription'])
            ->whereHas('activeSubscription', function ($q) use ($today) {
                $q->where('status', ClientSubscriptionStatusEnum::ACTIVE->value)
                    ->whereDate('end_date', '<', $today);
            })
            ->chunkById(100, function ($clients) use (&$expiredCount) {
                foreach ($clients as $client) {
                    $subscription = $client->activeSubscription()->first();
                    if (!$subscription) {
                        continue;
                    }
                    DB::transaction(function () use ($client, $subscription, &$expiredCount) {
                        $subscription->update([
                            'status' => ClientSubscriptionStatusEnum::EXPIRED->value,
                        ]);
                        if ($client->mikrotik_id) {
                            try {
                                $params = [];
                                if ($client->connection_type === 'hotspot') {
                                    $params['disabled'] = true; // hotspot expects boolean
                                } else {
                                    $params['disabled'] = 'yes'; // ppp expects yes/no
                                }
                                $client->service()->update($client->mikrotik_id, $params);
                            } catch (\Throwable $e) {
                                $this->error("Failed to disable client {$client->id} on MikroTik: {$e->getMessage()}");
                            }
                        }
                        $expiredCount++;
                    });
                }
            });

        // Activate pending subscriptions that start today or earlier and are not past end date
        $activatedCount = 0;
        Client::query()
            ->with(['subscriptions'])
            ->chunkById(100, function ($clients) use (&$activatedCount, $today) {
                foreach ($clients as $client) {
                    $pending = $client->subscriptions()
                        ->where('status', ClientSubscriptionStatusEnum::PENDING->value)
                        ->whereDate('start_date', '<=', $today)
                        ->when(function ($q) use ($today) {
                            $q->whereNull('end_date')->orWhereDate('end_date', '>=', $today);
                        })
                        ->orderBy('start_date')
                        ->first();

                    if (!$pending) {
                        continue;
                    }

                    DB::transaction(function () use ($client, $pending, &$activatedCount) {
                        // Expire any currently active subscriptions
                        $client->subscriptions()
                            ->where('status', ClientSubscriptionStatusEnum::ACTIVE->value)
                            ->update(['status' => ClientSubscriptionStatusEnum::EXPIRED->value]);

                        // Activate this one
                        $pending->update(['status' => ClientSubscriptionStatusEnum::ACTIVE->value]);

                        // Ensure client is enabled and using correct profile
                        if ($client->mikrotik_id) {
                            try {
                                $params = [
                                    'profile' => optional($pending->profile)->mikrotik_id,
                                ];
                                if ($client->connection_type === 'hotspot') {
                                    $params['disabled'] = false;
                                } else {
                                    $params['disabled'] = 'no';
                                }
                                $client->service()->update($client->mikrotik_id, $params);
                            } catch (\Throwable $e) {
                                $this->error("Failed to enable client {$client->id} on MikroTik: {$e->getMessage()}");
                            }
                        }

                        $activatedCount++;
                    });
                }
            });

        $this->info("Expired disabled: {$expiredCount}; Activated: {$activatedCount}");
        return self::SUCCESS;
    }
}
