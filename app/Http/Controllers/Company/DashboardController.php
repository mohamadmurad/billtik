<?php

namespace App\Http\Controllers\Company;


use App\Http\Controllers\Admin\BaseCrudController;
use App\Models\Client\Client;
use App\Models\ClientSubscription;
use App\Models\Profile\Profile;
use App\Models\Router;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends BaseCrudController
{
    protected string $route = 'test';
    protected string $resource = 'test';
    protected string $model = 'model';

    public function __invoke()
    {
        $companyId = Auth::user()->company_id;
        $routersCount = Router::byCompany($companyId)->count();
        $clientsCount = Client::byCompany($companyId)->count();
        $profilesCount = Profile::byCompany($companyId)->count();

        $subscriptionsActive = ClientSubscription::whereHas('client', fn($q) => $q->where('company_id', $companyId))
            ->where('status', 'active')->count();
        $subscriptionsPending = ClientSubscription::whereHas('client', fn($q) => $q->where('company_id', $companyId))
            ->where('status', 'pending')->count();
        $subscriptionsExpired = ClientSubscription::whereHas('client', fn($q) => $q->where('company_id', $companyId))
            ->where('status', 'expired')->count();

        return Inertia::render('dashboard', [
            'routersCount' => $routersCount,
            'clientsCount' => $clientsCount,
            'profilesCount' => $profilesCount,
            'stats' => [
                'subscriptions_active' => $subscriptionsActive,
                'subscriptions_pending' => $subscriptionsPending,
                'subscriptions_expired' => $subscriptionsExpired,
            ],
        ]);
    }
}
