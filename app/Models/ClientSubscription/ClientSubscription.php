<?php

namespace App\Models\ClientSubscription;

use App\Enums\ClientStatusEnum;
use App\Enums\ClientSubscriptionStatusEnum;
use App\Enums\ConnectionTypeEnum;
use App\Models\Client\Client;
use App\Models\Profile\Profile;
use App\Policies\ClientSubscription\ClientSubscriptionPolicy;
use App\Traits\HasAbilities;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

#[UsePolicy(ClientSubscriptionPolicy::class)]
class ClientSubscription extends Model
{
    use SoftDeletes, HasAbilities;

    protected $fillable = [
        'client_id', 'profile_id', 'start_date', 'end_date', 'status',
    ];

    protected $appends = ['status_meta'];

    public function getStatusMetaAttribute(): array|null
    {
        return ClientSubscriptionStatusEnum::tryFrom($this->status)?->meta();
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function stop()
    {
        DB::beginTransaction();
        try {

            /** @var Client $client */
            $client = $this->client;
            $service = $client->service();

            $params = [];
            if ($client->connection_type === ConnectionTypeEnum::HOTSPOT->value) {
                $params['disabled'] = true;
            } else {
                $params['disabled'] = 'yes';
            }
            $result = $service->update($client->mikrotik_id, $params);
            $connectionCount = $service->removeActiveConnection($client->mikrotik_username);
            if ($result) {
                $client->updateQuietly([
                    'status' => ClientStatusEnum::DEACTIVATE->value
                ]);
                $this->updateQuietly([
                    'status' => ClientSubscriptionStatusEnum::EXPIRED->value,
                ]);
            }
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }

    }

    /**
     * @throws \Exception
     */
    public function checkStatus(): void
    {
        $endDate = Carbon::parse($this->end_date);
        if ($endDate->gte(today()) && $this->status !== ClientSubscriptionStatusEnum::ACTIVE->value) {
            $this->activeSubscription();
        }
        if ($endDate->lt(today()) && $this->status === ClientSubscriptionStatusEnum::ACTIVE->value) {
            $this->stop();
        }
    }

    private function activeSubscription(): void
    {
        /** @var Client $client */
        DB::beginTransaction();
        try {
            $client = $this->client;
            $service = $client->service();
            $params = [];
            if ($client->connection_type === ConnectionTypeEnum::HOTSPOT->value) {
                $params['disabled'] = false;
            } else {
                $params['disabled'] = 'no';
            }
            $result = $service->update($client->mikrotik_id, $params);
            if ($result) {
                $client->updateQuietly([
                    'status' => ClientStatusEnum::ACTIVE->value
                ]);
                $this->updateQuietly([
                    'status' => ClientSubscriptionStatusEnum::ACTIVE->value,
                ]);
            }
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
    }

}
