<?php

namespace App\Services\Mikrotik\Ppp;


use App\Exceptions\MicrotikException;
use App\Services\Mikrotik\BaseMikrotikService;
use RouterOS\Exceptions\QueryException;
use RouterOS\Query;

class MikrotikPppClientSerice extends BaseMikrotikService
{
    public function get(): array
    {
        $this->ensureConnected();
        return $this->client->query('/ppp/secret/print')->read();
    }

    public function create($data): string
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
        throw  new MicrotikException('unknown error ', 500);
    }

    public function update(string $id, array $data): bool
    {
        $this->ensureConnected();

        $query = (new Query('/ppp/secret/set'))
            ->equal('.id', $id);

        foreach ($data as $key => $value) {
            $query->equal($key, $value);
        }
        $x = $this->client->query($query)->read();
        return true;
    }

    public function removeActiveConnection(string $username): int
    {
        $this->ensureConnected();
        try {
            $removedCount = 0;

            $query = new Query("/ppp/active/print");
            $query->where('name', $username);

            $activeConnections = $this->client->query($query)->read();

            foreach ($activeConnections as $connection) {
                if (isset($connection['.id'])) {
                    $removeQuery = new Query("/ppp/active/remove");
                    $removeQuery->equal('.id', $connection['.id']);

                    $this->client->query($removeQuery)->read();
                    $removedCount++;
                }
            }
            return $removedCount;
        } catch (QueryException $e) {
            logger()->error('Mikrotik remove PPP connections failed: ' . $e->getMessage());
            return 0;
        }

    }
}
