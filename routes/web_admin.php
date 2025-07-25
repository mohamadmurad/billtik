<?php


use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__ . '/auth_admin.php';
Route::prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/login');
    Route::middleware('auth:admin')->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
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

});

