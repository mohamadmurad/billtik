<?php


use App\Http\Controllers\Company\Client\HotspotClientController;
use App\Http\Controllers\Company\Client\PPPClientController;
use App\Http\Controllers\Company\ClientSubscriptionController;
use App\Http\Controllers\Company\DashboardController;
use App\Http\Controllers\Company\Profile\HotspotProfileController;
use App\Http\Controllers\Company\Profile\PPPProfileController;
use App\Http\Controllers\Company\InvoiceController;
use App\Http\Controllers\Company\RouterController;
use App\Http\Controllers\Company\Subscription\HotsoptSubscriptionController;
use App\Http\Controllers\Company\Subscription\HotspotSubscriptionController;
use App\Http\Controllers\Company\Subscription\PppSubscriptionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth:web', 'verified'])->name('company.')->group(function () {


    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('routers/search', [RouterController::class, 'search'])->name('routers.search');

    Route::name('ppp.')->prefix('ppp')->group(function () {
        Route::prefix('profiles')->name('profiles.')->group(function () {
            Route::post('{profile}/sync', [PPPProfileController::class, 'syncItem'])->name('sync');
            Route::post('/sync', [PPPProfileController::class, 'syncAll'])->name('sync-all');
            Route::get('/search', [PPPProfileController::class, 'search'])->name('search');
            Route::post('/{profile}/toggle-active', [PPPProfileController::class, 'toggleActive'])->name('toggle-active');
        });

        Route::resource('profiles', PPPProfileController::class)->parameters([
            'profile' => 'model'
        ]);
        Route::prefix('clients')->name('clients.')->group(function () {
            Route::post('{client}/sync', [PPPClientController::class, 'syncItem'])->name('sync');
            Route::post('/sync', [PPPClientController::class, 'syncAll'])->name('sync-all');
            Route::get('/search', [PPPClientController::class, 'search'])->name('search');
            Route::post('{client}/enable', [PPPClientController::class, 'enable'])->name('enable');
            Route::post('{client}/disable', [PPPClientController::class, 'disable'])->name('disable');
            Route::post('{client}/subscriptions', [PppSubscriptionController::class, 'storeForPPP'])->name('subscriptions.store');
        });
        Route::resource('clients', PPPClientController::class)->parameters([
            'client' => 'model'
        ]);
        Route::resource('subscriptions', PppSubscriptionController::class)->only('index');
    });

    Route::name('hotspot.')->prefix('hotspot')->group(function () {
        Route::prefix('profiles')->name('profiles.')->group(function () {
            Route::post('{profile}/sync', [HotspotProfileController::class, 'syncItem'])->name('sync');
            Route::post('/sync', [HotspotProfileController::class, 'syncAll'])->name('sync-all');
            Route::get('/search', [HotspotProfileController::class, 'search'])->name('search');
            Route::post('/{profile}/toggle-active', [HotspotProfileController::class, 'toggleActive'])->name('toggle-active');
        });

        Route::resource('profiles', HotspotProfileController::class)->parameters([
            'profile' => 'model'
        ]);
        Route::prefix('clients')->name('clients.')->group(function () {
            Route::post('{client}/sync', [HotspotClientController::class, 'syncItem'])->name('sync');
            Route::post('/sync', [HotspotClientController::class, 'syncAll'])->name('sync-all');
            Route::get('/search', [HotspotClientController::class, 'search'])->name('search');
            Route::post('{client}/enable', [HotspotClientController::class, 'enable'])->name('enable');
            Route::post('{client}/disable', [HotspotClientController::class, 'disable'])->name('disable');
            Route::post('{client}/subscriptions', [HotspotSubscriptionController::class, 'storeForHotspot'])->name('subscriptions.store');
        });
        Route::resource('clients', HotspotClientController::class)->parameters([
            'client' => 'model'
        ]);

        Route::resource('subscriptions', HotspotSubscriptionController::class)->only('index');
    });

    // Invoices
    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('invoices/client-details', [InvoiceController::class, 'clientDetails'])->name('invoices.client-details');


});

require __DIR__ . '/web_admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
