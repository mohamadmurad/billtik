<?php

namespace App\Http\Middleware;

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
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
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
                'type' => 'item',
                'title' => 'Dashboard',
                'href' => route('dashboard'),
                'icon' => 'LayoutGrid',
                'permission' => 'index roles',
                'isActive' => Route::is('dashboard'),
            ], [
                'type' => 'item',
                'title' => 'Companies',
                'href' => route('companies.index'),
                'icon' => 'Building',
                'permission' => 'index companies',
                'isActive' => Route::is('companies.*'),
            ], [
                'type' => 'item',
                'title' => 'Profiles',
                'href' => route('profiles.index'),
                'icon' => 'profiles',
                'permission' => 'index profiles',
                'isActive' => Route::is('profiles.*'),
            ], [
                'type' => 'item',
                'title' => 'Clients',
                'href' => route('clients.index'),
                'icon' => 'clients',
                'permission' => 'index clients',
                'isActive' => Route::is('clients.*'),
            ],
            [
                'type' => 'group',
                'group_label' => __('attributes.settings'),
                'items' => [
                    [
                        'type' => 'item',
                        'title' => 'Roles',
                        'href' => route('roles.index'),
                        'icon' => 'ShieldCheck',
                        'permission' => 'index roles',
                        'isActive' => Route::is('roles.*'),
                    ], [
                        'type' => 'item',
                        'title' => 'Users',
                        'href' => route('users.index'),
                        'icon' => 'Users',
                        'permission' => 'index users',
                        'isActive' => Route::is('users.*'),
                    ],
                ]
            ],
        ];

        // Filter based on user permissions
        return array_values(array_filter(
            array_map(function ($item) use ($user) {
                if ($item['type'] === 'item') {
                    return $user->can($item['permission']) ? $item : null;
                }

                if ($item['type'] === 'group' && isset($item['items'])) {
                    $item['items'] = array_values(array_filter($item['items'], function ($subItem) use ($user) {
                        return $user->can($subItem['permission']);
                    }));

                    return count($item['items']) > 0 ? $item : null;
                }

                return null;
            }, $allNavItems),
            fn($item) => !is_null($item)
        ));
    }
}
