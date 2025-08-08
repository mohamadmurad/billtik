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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Company::class)->constrained();
            $table->foreignIdFor(Router::class)->constrained();
            $table->string('mikrotik_id')->nullable();
            $table->string('connection_type');
            $table->string('name');
            $table->string('upload_input')->nullable();
            $table->string('download_input')->nullable();
            $table->string('download_unit')->nullable();
            $table->string('upload_unit')->nullable();
            $table->decimal('price', 10, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['name', 'connection_type','router_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
