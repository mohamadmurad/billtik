<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class PermissionFixCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permission:fix';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->withProgressBar(1, function () {
            $this->call('db:seed', ['--class' => 'RoleAndPermissionSeeder', '--force' => true]);
            $this->call('cache:forget', ['key' => config('permission.cache.key')]);
            $this->info('Permissions Seeded');
        });


    }
}
