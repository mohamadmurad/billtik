<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;


abstract class BaseCrudController extends Controller
{
    use AuthorizesRequests;

    protected string $resource = '';
    protected string $model = '';
    protected string $storeRequestClass = '';
    protected string $updateRequestClass = '';

    protected array $withEditRelations = [];
    protected array $withIndexRelations = [];
    protected array $withShowRelations = [];

    protected ?Authenticatable $user;

    public function __construct()
    {
        if (empty($this->resource)) {
            throw new \RuntimeException(static::class . ' must define a non-empty $resource.');
        }
        if (empty($this->model)) {
            throw new \RuntimeException(static::class . ' must define a non-empty $model.');
        }
        $this->user = Auth::user();

    }

    /**
     * Display a listing of the resource.
     * @throws AuthorizationException
     */
    public function index(): Response
    {
        $this->authorize('viewAny', $this->model);
        $query = $this->customIndexQuery($this->model::with($this->withIndexRelations ?? []));
        return Inertia::render("admin/$this->resource/index", array_merge([
            'items' => $query->paginate(),
        ], $this->indexExtraData()));
    }

    protected function indexExtraData(): array
    {
        return []; // Override in child controller when needed
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', $this->model);
        if (empty($this->storeRequestClass)) {
            throw new \RuntimeException(static::class . ' must define a non-empty $storeRequestClass.');
        }

        // Resolve and auto-validate the request class (e.g. StoreUserRequest)
        $validateRequest = app($this->storeRequestClass);
        $validated = $validateRequest->validated();

        // Optionally modify or append extra fields (user_id, slug, etc.)
        $data = $this->transformBeforeCreate($validated);
        DB::beginTransaction();
        try {
            // Create the main model
            $item = $this->model::create($data);

            // Handle any relationships or side effects (roles, files, logs, etc.)
            $this->afterStore($item, $request);

            DB::commit();

            // Redirect back with success
            return redirect()->route($this->resource . '.index')->with('success', 'created successfully.');
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error($exception->getMessage());
            // Redirect back with success
            return redirect()->back()->with('error', 'An error occurred.');
        }


    }

    protected function transformBeforeCreate(array $data): array
    {
        return $data; // default does nothing
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', $this->model);
        return Inertia::render("admin/$this->resource/create", $this->createExtraData());
    }

    protected function createExtraData(): array
    {
        return [];
    }

    protected function afterStore(Model $model, Request $request): void
    {
        // default does nothing
    }

    /**
     * Display the specified resource.
     */
    public function show(int $model): Response
    {
        $model = $this->model::findOrFail($model);
        $this->authorize('view', $model);
        $model->load($this->withShowRelations ?? []);
        return Inertia::render("admin/$this->resource/show", array_merge([
            'model' => $model,
        ], $this->showExtraData($model)));
    }

    protected function showExtraData(Model $model): array
    {
        return []; // Override in child controller when needed
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $model): Response
    {
        $model = $this->model::findOrFail($model);
        $this->authorize('update', $model);
        $model->load($this->withEditRelations ?? []);
        return Inertia::render("admin/$this->resource/edit", array_merge([
            'model' => $model,
        ], $this->editExtraData($model)));
    }

    protected function editExtraData(): array
    {
        return []; // Override in child controller when needed
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $model): RedirectResponse
    {

        if (empty($this->updateRequestClass)) {
            throw new \RuntimeException(static::class . ' must define a non-empty $updateRequestClass.');
        }
        $model = $this->model::findOrFail($model);
        $this->authorize('update', $model);
        // Resolve and auto-validate the request class (e.g. StoreUserRequest)
        $validateRequest = app($this->updateRequestClass);
        $validated = $validateRequest->validated();

        // Optionally modify or append extra fields (user_id, slug, etc.)
        $data = $this->transformBeforeUpdate($validated);
        DB::beginTransaction();
        try {
            // update main model
            $model->update($data);

            // Handle any relationships or side effects (roles, files, logs, etc.)
            $this->afterUpdate($model, $request);
            DB::commit();
            // Redirect back with success
            return redirect()->route($this->resource . '.index')->with('success', 'Updated successfully.');

        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error($exception->getMessage());
            return redirect()->back()->with('success', 'An error occurred.');
        }

    }

    protected function transformBeforeUpdate(array $data): array
    {
        return $data; // default does nothing
    }

    protected function afterUpdate(Model $model, Request $request): void
    {
        // default does nothing
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $model): RedirectResponse
    {
        $model = $this->model::findOrFail($model);
        $this->authorize('delete', $model);
        $model->delete();
        return redirect()->route($this->resource . '.index')->with('success', 'Deleted successfully.');
    }


    protected function customIndexQuery(Builder $query): Builder
    {
        return $query;
    }

}
