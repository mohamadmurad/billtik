<?php

namespace App\Http\Middleware;

use App\Models\User;
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
        $guard = Auth::guard()->name;

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
            'sidebar' => Auth::guard($guard)->check() ? $this->getSidebarItems($request->user()) : [],
            'locale' => fn() => App::getLocale(),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'translations' => [
                'attributes' => fn() => __('attributes'),
                'pagination' => fn() => __('pagination'),
                'messages' => fn() => __('messages'),
            ],
        ];
    }

    private function getSidebarItems($user): array
    {
        $superAdmin = [
            [
                'type' => 'item',
                'title' => 'Dashboard',
                'href' => route('dashboard'),
                'icon' => 'LayoutGrid',
                //'permission' => 'index roles',
                'isActive' => Route::is('dashboard'),
            ],
            [
                'type' => 'item',
                'title' => 'Companies',
                'href' => route('admin.companies.index'),
                'icon' => 'Building',
                'permission' => 'index companies',
                'isActive' => Route::is('admin.companies.*'),
            ], [
                'type' => 'item',
                'title' => 'Routers',
                'href' => route('admin.routers.index'),
                'icon' => 'Router',
                'permission' => 'index routers',
                'isActive' => Route::is('admin.routers.*'),
            ],
            [
                'type' => 'group',
                'group_label' => __('attributes.settings'),
                'items' => [
                    [
                        'type' => 'item',
                        'title' => 'Roles',
                        'href' => route('admin.roles.index'),
                        'icon' => 'ShieldCheck',
                        'permission' => 'index roles',
                        'isActive' => Route::is('admin.roles.*'),
                    ], [
                        'type' => 'item',
                        'title' => 'Users',
                        'href' => route('admin.users.index'),
                        'icon' => 'Users',
                        'permission' => 'index users',
                        'isActive' => Route::is('admin.users.*'),
                    ],
                ]
            ],
        ];
        $allNavItems = [
            [
                'type' => 'item',
                'title' => 'Dashboard',
                'href' => route('dashboard'),
                'icon' => 'LayoutGrid',
                //'permission' => 'index roles',
                'isActive' => Route::is('dashboard'),
            ],
            [
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

        ];
        /** @var User $user */
        // Filter based on user permissions
        return array_values(array_filter(
            array_map(function ($item) use ($user) {
                if ($item['type'] === 'item') {
                    if (isset($item['permission'])) {
                        return $user->can($item['permission']) ? $item : null;
                    } else {
                        return $item;
                    }

                }

                if ($item['type'] === 'group' && isset($item['items'])) {
                    $item['items'] = array_values(array_filter($item['items'], function ($subItem) use ($user) {
                        if (isset($subItem['permission'])) {
                            return $user->can($subItem['permission']);
                        }
                        return true;
                    }));

                    return count($item['items']) > 0 ? $item : null;
                }

                return null;
            }, $user->isAdmin() ? $superAdmin : $allNavItems),
            fn($item) => !is_null($item)
        ));
    }
}
