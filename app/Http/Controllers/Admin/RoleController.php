<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    protected string $resource = 'roles';
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render("admin/$this->resource/index", [
            'items' => Role::paginate(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {

        return Inertia::render("admin/$this->resource/create", [
            'permissions' => $this->getGroupedPermissions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::create([
            'name' => $request->get('name'),
            'guard_name' => 'web'
        ]);
        $role->syncPermissions($request->get('permissions'));

        return redirect()->route($this->resource . '.index')->with('success', 'created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role): Response
    {
        $role->load('permissions');
        return Inertia::render("admin/$this->resource/edit", [
            'role' => $role,
            'permissions' => $this->getGroupedPermissions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreRoleRequest $request, Role $role): RedirectResponse
    {
        $role->update([
            'name' => $request->get('name'),
            'guard_name' => 'web'
        ]);
        $role->syncPermissions($request->get('permissions'));

        return redirect()->route($this->resource . '.index')->with('success', 'Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();
        return redirect()->route($this->resource . '.index')->with('success', 'Deleted successfully.');
    }


}
