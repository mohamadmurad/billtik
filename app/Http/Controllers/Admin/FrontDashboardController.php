<?php

namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Profile;
use App\Models\Router;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FrontDashboardController extends BaseCrudController
{
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
