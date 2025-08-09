<?php

namespace App\Services\Mikrotik\Hotspot;


use App\Exceptions\MicrotikException;
use App\Services\Mikrotik\BaseMikrotikService;
use RouterOS\Exceptions\ClientException;
use RouterOS\Exceptions\ConfigException;
use RouterOS\Exceptions\QueryException;
use RouterOS\Query;

class MikrotikHotspotProfileSerice extends BaseMikrotikService
{
    public function get(): array
    {
        $this->ensureConnected();
        $result = $this->client->query('/ip/hotspot/user/profile/print')->read();
        if (isset($result['after']['message'])) {
            throw  new MicrotikException($result['after']['message']);
        }
        return $result;
    }

    /**
     * @throws ClientException
     * @throws QueryException
     * @throws MicrotikException
     * @throws ConfigException
     */
    public function create($data): string
    {
        $this->ensureConnected();

        $query = (new Query('/ip/hotspot/user/profile/add'))
            ->equal('name', $data['name']);

        if (isset($data['rate-limit'])) {
            $query->equal('rate-limit', $data['rate-limit']);
        }

        // Session timeout
        if (isset($data['session-timeout'])) {
            $query->equal('session-timeout', $data['session-timeout']);
        }

        // Idle timeout
        if (isset($data['idle-timeout'])) {
            $query->equal('idle-timeout', $data['idle-timeout']);
        }

        // Shared users (how many devices can use this profile simultaneously)
        if (isset($data['shared-users'])) {
            $query->equal('shared-users', $data['shared-users']);
        }

        // Address pool (if using DHCP)
        if (isset($data['address-pool'])) {
            $query->equal('address-pool', $data['address-pool']);
        }

        // Parent queue (for QoS)
        if (isset($data['parent-queue'])) {
            $query->equal('parent-queue', $data['parent-queue']);
        }

        $result = $this->client->query($query)->read(true);


        if (isset($result['after']['ret'])) {
            return $result['after']['ret'];
        }
        if (isset($result['after']['message'])) {
            throw  new MicrotikException($result['after']['message']);
        }

        throw new MicrotikException('Unknown error creating hotspot profile', 500);
    }

    public function update(string $id, array $data): bool
    {
        $this->ensureConnected();

        $query = (new Query('/ip/hotspot/user/profile/set'))
            ->equal('.id', $id);

        foreach ($data as $key => $value) {
            $query->equal($key, $value);
        }
        $read = $this->client->query($query)->read();
        return true;
    }
}
