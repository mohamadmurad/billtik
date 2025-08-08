<?php

use App\Models\Company;
use App\Models\Router;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Company::class)->constrained();
            $table->foreignIdFor(Router::class)->constrained();
            $table->string('microtik_id')->nullable();
            $table->string('connection_type');
            $table->string('name')->nullable();
            $table->string('mikrotik_username');
            $table->string('mikrotik_password');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('id_number')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['company_id', 'name', 'router_id', 'deleted_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
