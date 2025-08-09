<?php

namespace App\Services\Mikrotik\Hotspot;



use App\Exceptions\MicrotikException;
use App\Services\Mikrotik\BaseMikrotikService;
use RouterOS\Query;


class MikrotikHotspotClientSerice extends BaseMikrotikService
{
    public function get(): array
    {
        $this->ensureConnected();
        $result = $this->client->query('/ip/hotspot/user/print')->read();
        if (isset($result['after']['message'])) {
            throw  new MicrotikException($result['after']['message']);
        }
        return $result;
    }

    public function create($data): string
    {
        $this->ensureConnected();

        $query = (new Query('/ip/hotspot/user/add'))
            ->equal('name', $data['username'])
            ->equal('password', $data['password'])
            ->equal('profile', $data['profile'] ?? 'default');

        // Required for proper login handling
        $query->equal('disabled', $data['disabled'] ?? 'no');

        // Bandwidth limitations
        if (isset($data['limit-bytes-in'])) {
            $query->equal('limit-bytes-in', $data['limit-bytes-in']);
        }

        if (isset($data['limit-bytes-out'])) {
            $query->equal('limit-bytes-out', $data['limit-bytes-out']);
        }

        // Time limitations
        if (isset($data['limit-uptime'])) {
            $query->equal('limit-uptime', $data['limit-uptime']);
        }

        // IP address binding (optional)
        if (isset($data['address'])) {
            $query->equal('address', $data['address']);
        }

        // MAC address binding (optional)
        if (isset($data['mac-address'])) {
            $query->equal('mac-address', $data['mac-address']);
        }

        // Email for notifications (optional)
        if (isset($data['email'])) {
            $query->equal('email', $data['email']);
        }

        // Comment/note (optional)
        if (isset($data['comment'])) {
            $query->equal('comment', $data['comment']);
        }

        $result = $this->client->query($query)->read();

        if (isset($result['after']['ret'])) {
            return $result['after']['ret'];
        }
        throw new MicrotikException('Unknown error creating hotspot profile', 500);
    }

    public function update(string $id, array $data): bool
    {
        $this->ensureConnected();

        $query = (new Query('/ip/hotspot/user/set'))
            ->equal('.id', $id);

        // Required fields
        if (isset($data['username'])) {
            $query->equal('name', $data['username']);
        }

        if (isset($data['password'])) {
            $query->equal('password', $data['password']);
        }

        if (isset($data['profile'])) {
            $query->equal('profile', $data['profile']);
        }

        // Optional fields
        if (isset($data['disabled'])) {
            $query->equal('disabled', $data['disabled'] ? 'yes' : 'no');
        }

        if (isset($data['limit-bytes-in'])) {
            $query->equal('limit-bytes-in', $data['limit-bytes-in']);
        }

        if (isset($data['limit-bytes-out'])) {
            $query->equal('limit-bytes-out', $data['limit-bytes-out']);
        }

        if (isset($data['limit-uptime'])) {
            $query->equal('limit-uptime', $data['limit-uptime']);
        }

        if (isset($data['address'])) {
            $query->equal('address', $data['address']);
        }

        if (isset($data['mac-address'])) {
            $query->equal('mac-address', $data['mac-address']);
        }

        if (isset($data['email'])) {
            $query->equal('email', $data['email']);
        }

        if (isset($data['comment'])) {
            $query->equal('comment', $data['comment']);
        }

        $result = $this->client->query($query)->read();

        // Successful update returns empty array
        return empty($result['after']);
    }
}
