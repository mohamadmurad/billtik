<?php

namespace App\Services;

use App\Exceptions\MicrotikException;
use App\Models\Router;
use RouterOS\Client;
use RouterOS\Config;
use RouterOS\Query;

class MikroTikService
{





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
     * Remove a PPP profile
     */
    public function removePPPProfile(string $id): array
    {
        $this->ensureConnected();
        $query = (new Query('/ppp/profile/remove'))
            ->equal('.id', $id);

        return $this->client->query($query)->read();
    }








}
