<?php

namespace App\Services\Mikrotik\Ppp;


use App\Exceptions\MicrotikException;
use App\Services\Mikrotik\BaseMikrotikService;
use RouterOS\Exceptions\ClientException;
use RouterOS\Exceptions\ConfigException;
use RouterOS\Exceptions\QueryException;
use RouterOS\Query;

class MikrotikPppProfileSerice extends BaseMikrotikService
{

    public  function get(): array
    {
        $this->ensureConnected();
        $result = $this->client->query('/ppp/profile/print')->read();
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

    public function update(string $id, array $data): bool
    {
        $this->ensureConnected();

        $query = (new Query('/ppp/profile/set'))
            ->equal('.id', $id);

        foreach ($data as $key => $value) {
            $query->equal($key, $value);
        }
        $read = $this->client->query($query)->read();
        return true;
    }
}
