<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => $request->cookie('sidebar_state') === 'true',
            'sidebar' => Auth::check() ? $this->getSidebarItems($request->user()) : [],
            'locale' => fn() => App::getLocale(),
            'translations' => [
                'attributes' => fn() => __('attributes'),
                'pagination' => fn() => __('pagination'),
                'messages' => fn() => __('messages'),
            ],
        ];
    }

    private function getSidebarItems($user): array
    {
        $allNavItems = [
            [
                'title' => 'Dashboard',
                'url' => route('dashboard'),
                'icon' => 'LayoutGrid',
                'permission' => 'view_dashboard',
                'isActive' => Route::is('dashboard'),
            ],
            [
                'title' => 'Roles',
                'url' => route('roles.index'),
                'icon' => 'ShieldCheck',
                'permission' => 'index roles',
                'isActive' => Route::is('roles.*'),
            ],
            [
                'title' => 'Users',
                'url' => route('users.index'),
                'icon' => 'Users',
                'permission' => 'index users',
                'isActive' => Route::is('users.*'),
            ],
        ];

        // Filter based on user permissions
        return array_values(array_filter($allNavItems, fn($item) => $user->can($item['permission'])));
    }
}
