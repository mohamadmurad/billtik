<?php

namespace App\Http\Controllers\Company;


use App\Http\Controllers\Admin\BaseCrudController;
use App\Models\Client\Client;
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
        $routersCount = Router::byCompany(Auth::user()->company_id)->count();
        $clientsCount = Client::byCompany(Auth::user()->company_id)->count();
        $profilesCount = Profile::byCompany(Auth::user()->company_id)->count();

        return Inertia::render('dashboard', compact('routersCount', 'clientsCount', 'profilesCount'));
    }
}
