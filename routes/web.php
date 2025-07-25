<?php

use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth:web', 'verified'])->group(function () {


    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');



    Route::resource('profiles', ProfileController::class)->parameters([
        'profile' => 'model'
    ]);
    Route::resource('clients', ClientController::class)->parameters([
        'client' => 'model'
    ]);
});

require __DIR__ . '/web_admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
