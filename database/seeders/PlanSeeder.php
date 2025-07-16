<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        DB::table('plans')->updateOrInsert([
            'id' => 1,
        ], [

            'name' => json_encode([
                'en' => 'Starter',
                'ar' => 'مبتدأ',
            ]),
            'description' => null,
            'max_clients' => 50,
            'price' => 0,
            'is_active' => true,
            'created_at' => '2025-07-16',
            'updated_at' => now(),

        ]);
        DB::table('plans')->updateOrInsert([
            'id' => 2,
        ], [

            'name' => json_encode([
                'en' => 'Advanced',
                'ar' => 'متقدم',
            ]),
            'description' => null,
            'max_clients' => 150,
            'price' => 0,
            'is_active' => true,
            'created_at' => '2025-07-16',
            'updated_at' => now(),

        ]);

    }
}
