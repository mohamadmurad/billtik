<?php

namespace App\Services\Mikrotik;


use App\Models\Router;
use Exception;
use RouterOS\Client;
use RouterOS\Config;

abstract class BaseMikrotikService
{
    protected Client $client;
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

    protected function ensureConnected(): void
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

    abstract public function get(): array;

    abstract public function create($data): string;

    abstract public function update(string $id, array $data): bool;
}
