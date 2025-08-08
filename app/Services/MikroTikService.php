<?php

namespace App\Services;

use App\Exceptions\MicrotikException;
use App\Models\Router;
use RouterOS\Client;
use RouterOS\Config;
use RouterOS\Query;

class MikroTikService
{
    private Client $client;
    private $connected = false;

    public function __construct(protected Router $router)
    {
        $this->connect();
    }

    private function connect(): void
    {
        try {
            $config = new Config([
                'host' => $this->router->ip,
                'user' => $this->router->username,
                'pass' => $this->router->password,
                'port' => $this->router->port,
                'timeout' => 5,
                'ssh_timeout' => 5
            ]);
            $this->client = new Client($config);
            $this->connected = true;
        } catch (\Exception $e) {
            throw new \Exception("Failed to connect to MikroTik: (" . $this->router->ip . ') :' . $e->getMessage());
        }
    }

    /**
     * Create a new PPP secret
     */
    public function createPPPSecert(array $data): ?string
    {
        $this->ensureConnected();

        $query = (new Query('/ppp/secret/add'))
            ->equal('name', $data['username'])
            ->equal('password', $data['password'])
            ->equal('service', $data['service'] ?? 'pppoe')
            ->equal('profile', $data['profile'] ?? 'default');

        if (isset($data['remote-address'])) {
            $query->equal('remote-address', $data['remote-address']);
        }

        if (isset($data['local-address'])) {
            $query->equal('local-address', $data['local-address']);
        }
        $result = $this->client->query($query)->read();
        if (isset($result['after']['ret'])) {
            return $result['after']['ret'];
        }
        return null;

    }

    /**
     * Get all PPP secrets
     */
    public function getAllPPPScrets(): array
    {
        $this->ensureConnected();
        return $this->client->query('/ppp/secret/print')->read();
    }

    /**
     * Get a specific PPP secret by username
     */
    public function getPPPScret(string $username): ?array
    {
        $this->ensureConnected();
        $query = (new Query('/ppp/secret/print'))
            ->where('name', $username);

        $response = $this->client->query($query)->read();
        return $response[0] ?? null;
    }

    /**
     * Update a PPP secret
     */
    public function updatePPPScret(string $id, array $data): array
    {
        $this->ensureConnected();

        $query = (new Query('/ppp/secret/set'))
            ->equal('.id', $id);

        foreach ($data as $key => $value) {
            $query->equal($key, $value);
        }

        return $this->client->query($query)->read();
    }

    /**
     * Disable a PPP secret
     */
    public function disablePPPScret(string $id): array
    {
        return $this->updatePPPScret($id, ['disabled' => 'yes']);
    }

    /**
     * Enable a PPP secret
     */
    public function enablePPPScret(string $id): array
    {
        return $this->updatePPPScret($id, ['disabled' => 'no']);
    }

    /**
     * Remove a PPP secret
     */
    public function removePPPScret(string $id): array
    {
        $this->ensureConnected();
        $query = (new Query('/ppp/secret/remove'))
            ->equal('.id', $id);

        return $this->client->query($query)->read();
    }

    /**
     * Create a new PPP profile
     * @throws MicrotikException
     */
    public function createPPPProfile(array $data): string
    {
        $this->ensureConnected();

        $query = (new Query('/ppp/profile/add'))
            ->equal('name', $data['name']);

        if (isset($data['local-address'])) {
            $query->equal('local-address', $data['local-address']);
        }

        if (isset($data['remote-address'])) {
            $query->equal('remote-address', $data['remote-address']);
        }

        if (isset($data['rate-limit'])) {
            $query->equal('rate-limit', $data['rate-limit']);
        }
        $result = $this->client->query($query)->read(true);


        if (isset($result['after']['ret'])) {
            return $result['after']['ret'];
        }
        if (isset($result['after']['message'])) {
            throw  new MicrotikException($result['after']['message']);
        }

        throw  new MicrotikException('unknown error ', 500);
    }

    public function updatePPPProfile(string $profileId, array $updateData): array
    {
        $this->ensureConnected();

        $query = (new Query('/ppp/profile/set'))
            ->equal('.id', $profileId);

        foreach ($updateData as $key => $value) {
            $query->equal($key, $value);
        }

        return $this->client->query($query)->read();
    }

    /**
     * Get all PPP profiles
     * @throws MicrotikException
     */
    public function getAllPPPProfiles(): array
    {
        $this->ensureConnected();
        $result = $this->client->query('/ppp/profile/print')->read();
        if (isset($result['after']['message'])) {
            throw  new MicrotikException($result['after']['message']);
        }
        return $result;
    }

    /**
     * Remove a PPP profile
     */
    public function removePPPProfile(string $id): array
    {
        $this->ensureConnected();
        $query = (new Query('/ppp/profile/remove'))
            ->equal('.id', $id);

        return $this->client->query($query)->read();
    }


    /**
     * Create a new PPP profile
     * @throws MicrotikException
     */
    public function createHotspotProfile(array $data): string
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

    public function updateHotspotProfile(string $profileId, array $updateData): array
    {
        $this->ensureConnected();

        $query = (new Query('/ip/hotspot/user/profile/set'))
            ->equal('.id', $profileId);

        foreach ($updateData as $key => $value) {
            $query->equal($key, $value);
        }

        return $this->client->query($query)->read();
    }
    /**
     * Get all PPP profiles
     * @throws MicrotikException
     */
    public function getAllHotspotProfiles(): array
    {
        $this->ensureConnected();
        $result = $this->client->query('/ip/hotspot/user/profile/print')->read();
        if (isset($result['after']['message'])) {
            throw  new MicrotikException($result['after']['message']);
        }
        return $result;
    }
    public function createHotspotUser(array $data): ?string
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
        return null;
    }
    public function updateHotspotUser(string $userId, array $data): bool
    {
        $this->ensureConnected();

        $query = (new Query('/ip/hotspot/user/set'))
            ->equal('.id', $userId);

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

    private function ensureConnected(): void
    {
        if (!$this->connected) {
            throw new Exception("Not connected to MikroTik router");
        }
    }

    public function __destruct()
    {
        // Clean up connection
        unset($this->client);
    }




}
