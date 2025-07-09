<?php

use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {


    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::resource('roles', RoleController::class)->parameters([
        'roles' => 'model'
    ]);

    Route::put('users/{user}/update-permissions', [UserController::class, 'updatePermissions'])->name('users.update-permissions');
    Route::resource('users', UserController::class)->parameters([
        'users' => 'model'
    ]);

    Route::resource('companies', CompanyController::class)->parameters([
        'company' => 'model'
    ]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
