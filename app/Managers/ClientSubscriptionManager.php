<?php

namespace App\Managers;

use App\Enums\ClientSubscriptionStatusEnum;
use App\Enums\ConnectionTypeEnum;
use App\Jobs\SendItemToMikrotik;
use App\Models\Client\Client;
use App\Models\Profile\Profile;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ClientSubscriptionManager
{
    public static function make(): static
    {
        return new static();
    }

    public function create(Client $client, int $profile_id, string $startDate, ?string $endDate = null)
    {
        $this->checkIfThereIsSubscriptionInPeriod($client, $startDate, $endDate);
        $profile = Profile::query()
            ->where('connection_type', $client->connection_type)
            ->where('company_id', $client->company_id)
            ->where('router_id', $client->router_id)
            ->findOrFail($profile_id);

        $startDate = Carbon::parse($startDate)->toDateString();
        $endDate = Carbon::parse($endDate)->toDateString();
        $today = now()->toDateString();
        $status = ClientSubscriptionStatusEnum::PENDING->value;
        if ($startDate <= $today && (is_null($endDate) || $endDate >= $today)) {
            $status = ClientSubscriptionStatusEnum::ACTIVE->value;
        } elseif (!is_null($endDate) && $endDate < $today) {
            $status = ClientSubscriptionStatusEnum::EXPIRED->value;
        }

        DB::transaction(function () use ($client, $profile, $startDate, $endDate, $status) {
            if ($status === ClientSubscriptionStatusEnum::ACTIVE->value) {
                $client->subscriptions()
                    ->where('status', ClientSubscriptionStatusEnum::ACTIVE->value)
                    ->update(['status' => ClientSubscriptionStatusEnum::EXPIRED->value]);
            }

            $subscription = $client->subscriptions()->create([
                'profile_id' => $profile->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status,
            ]);

            if ($status === ClientSubscriptionStatusEnum::ACTIVE->value) {
                if ($client->mikrotik_id) {
                    try {
                        $params = [
                            'profile' => $profile->mikrotik_id,
                        ];
                        if ($client->connection_type === ConnectionTypeEnum::HOTSPOT->value) {
                            $params['disabled'] = false;
                        } else {
                            $params['disabled'] = 'no';
                        }
                        $client->service()->update($client->mikrotik_id, $params);
                    } catch (\Throwable $e) {
                        dispatch(new SendItemToMikrotik($client, 'update'));
                    }
                } else {
                    dispatch(new SendItemToMikrotik($client));
                }
            }
        });
    }

    /**
     * @throws \Throwable
     */
    private function checkIfThereIsSubscriptionInPeriod(Client $client, string $startDate, ?string $endDate): void
    {
        $existsSubscriptions = $client->subscriptions()
            ->whereDate('start_date', '<=', $startDate)
            ->whereDate('end_date', '>=', $endDate)
            ->where('status', ClientSubscriptionStatusEnum::ACTIVE->value)->exists();
        throw_if($existsSubscriptions, new \Exception('Client has Subscription in this period'));
    }

}
