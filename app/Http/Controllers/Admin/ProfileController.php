<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Http\Requests\Admin\Profile\StoreProfileRequest;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Models\Company;
use App\Models\Profile;
use App\Models\Role;
use App\Models\Router;
use App\Services\MikroTikService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends BaseCrudController
{
    protected string $resource = 'profiles';
    protected string $model = Profile::class;
    protected string $storeRequestClass = StoreProfileRequest::class;
    protected string $updateRequestClass = StoreProfileRequest::class;

    protected array $withShowRelations = ['router'];
    protected array $withIndexRelations = ['router'];


    public function globalQuery($query)
    {
        return $query->byCompany($this->user->company_id);
    }

    public function filterFields(): array
    {
        return [
            [
                'name' => 'router_id',
            ], [
                'name' => 'search',
                'cond' => 'like',
                'field' => 'name',
            ]
        ];
    }

    protected function transformBeforeCreate(array $data): array
    {
        $data['company_id'] = $this->user->company_id;
        return $data;

    }

    /**
     * @throws \Exception
     */
    protected function afterStore(Model $model, Request $request): void
    {
        try {
            /** @var  Profile $model */
            $service = $model->service();
            $rateLimit = $model->upload_input . $model->upload_unit . '/' . $model->download_input . $model->download_unit;
            $remoteId = $service->createPPPProfile([
                'name' => $model->name['en'],
                'rate-limit' => $rateLimit,
            ]);
            $model->update([
                'microtik_id' => $remoteId,
            ]);
        } catch (\Exception $exception) {
            throw $exception;
        }


    }

    protected function afterUpdate(Model $model, Request $request): void
    {
        try {
            $service = $model->service();
            $rateLimit = $model->upload_input . $model->upload_unit . '/' . $model->download_input . $model->download_unit;
            if ($model->microtik_id) {
                $remoteId = $service->updatePPPProfile($model->microtik_id, [
                    'name' => $model->name['en'],
                    'rate-limit' => $rateLimit,
                ]);
            } else {
                $remoteId = $service->createPPPProfile([
                    'name' => $model->name['en'],
                    'rate-limit' => $rateLimit,
                ]);
                $model->update([
                    'microtik_id' => $remoteId,
                ]);
            }

        } catch (\Exception $exception) {

        }

    }

    public function syncItem(Request $request, Profile $profile): RedirectResponse
    {
        $this->authorize('sync', $profile);
        try {
            $profile->syncToServer();
            return redirect()->back()->with('success', __('messages.sync_success'));
        } catch (\Exception $exception) {
            return redirect()->back()->with('error', $exception->getMessage());
        }


    }

    public function syncAll(Request $request): RedirectResponse
    {
        $this->authorize('fetchAll', Profile::class);
        try {
            $errors = [];
            $routers = Router::byCompany(Auth::user()->company_id)->get();
            foreach ($routers as $router) {
                try {
                    $service = new MikroTikService($router);
                    $results = $service->getAllPPPProfiles();
                    foreach ($results as $result) {
                        if (!isset($result['.id']) || !isset($result['rate-limit'])) continue;
                        $profile = Profile::createFromMicrotik($router, $result, Auth::user()->company_id);
                    }
                } catch (\Exception $exception) {
                    $errors[] = $exception->getMessage();
                }
            }
            if ($errors) {
                return redirect()->back()->with('errors_messages', $errors);
            }
            return redirect()->back()->with('success', __('messages.sync_success'));
        } catch (\Exception $exception) {
            return redirect()->back()->with('error', $exception->getMessage());
        }


    }

    public function formatSearchItem($item)
    {
        return [
            'value' => $item->id,
            'label' => $item->local_name,
        ];
    }

}
