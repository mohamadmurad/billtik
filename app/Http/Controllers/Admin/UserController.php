<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\StoreUserRequest;
use App\Http\Requests\Admin\User\UpdateUserPermissionsRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    protected string $resource = 'users';

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render("admin/$this->resource/index", [
            'items' => User::paginate(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {

        return Inertia::render("admin/$this->resource/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $item = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => $request->get('password'),
        ]);
        return redirect()->route($this->resource . '.index')->with('success', 'created successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $roles = Role::all();
        $user->load('roles', 'permissions');
        return Inertia::render("admin/$this->resource/show", [
            'model' => $user,
            'roles' => $roles,
            'permissions' => $this->getGroupedPermissions(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        return Inertia::render("admin/$this->resource/edit", [
            'model' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
        ]);
        if ($request->filled('password')) {
            $user->update([
                'password' => $request->get('password'),
            ]);
        }

        return redirect()->route($this->resource . '.index')->with('success', 'Updated successfully.');
    }

    /**
     * Update the Permissions resource in storage.
     */
    public function updatePermissions(UpdateUserPermissionsRequest $request, User $user): RedirectResponse
    {
        $user->syncPermissions($request->get('permissions'));
        $user->syncRoles($request->get('roles'));
        $user->refresh();
        return redirect()->route($this->resource . '.show', $user)->with('success', 'Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();
        return redirect()->route($this->resource . '.index')->with('success', 'Deleted successfully.');
    }

}
