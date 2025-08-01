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
