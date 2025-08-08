<?php

namespace App\Http\Controllers\Company\Profile;

use App\Enums\ConnectionTypeEnum;
use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Admin\Profile\StoreHotspotProfileRequest;
use App\Models\Profile\HotspotProfile;
use App\Models\Router;
use App\Services\MikroTikService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HotspotProfileController extends BaseCrudController
{
    protected string $route = 'company.hotspot.profiles';
    protected string $resource = 'hotspot/profiles';
    protected string $model = HotspotProfile::class;
    protected string $storeRequestClass = StoreHotspotProfileRequest::class;
    protected string $updateRequestClass = StoreHotspotProfileRequest::class;

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
        $data['connection_type'] = ConnectionTypeEnum::HOTSPOT->value;
        return $data;

    }

    /**
     * @throws \Exception
     */
    protected function afterStore(Model $model, Request $request): void
    {
        try {
            /** @var  HotspotProfile $model */
            $service = $model->service();
            $rateLimit = $model->upload_input . $model->upload_unit . '/' . $model->download_input . $model->download_unit;
            $remoteId = $service->createHotspotProfile([
                'name' => $model->name['en'],
                'rate-limit' => $rateLimit,
            ]);
            $model->update([
                'microtik_id' => $remoteId,
            ]);
        } catch (\Exception $exception) {

        }


    }

    protected function afterUpdate(Model $model, Request $request): void
    {
        try {
            /** @var HotspotProfile $model */
            $service = $model->service();
            $rateLimit = $model->upload_input . $model->upload_unit . '/' . $model->download_input . $model->download_unit;
            if ($model->microtik_id) {
                $remoteId = $service->updateHotspotProfile($model->microtik_id, [
                    'name' => $model->name['en'],
                    'rate-limit' => $rateLimit,
                ]);
            } else {
                $remoteId = $service->createHotspotProfile([
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

    public function syncItem(Request $request, HotspotProfile $profile): RedirectResponse
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
        $this->authorize('fetchAll', HotspotProfile::class);
        try {
            $errors = [];
            $routers = Router::byCompany(Auth::user()->company_id)->get();
            foreach ($routers as $router) {
                try {
                    $service = new MikroTikService($router);
                    $results = $service->getAllHotspotProfiles();
                    foreach ($results as $result) {
                        if (!isset($result['.id'])) continue;
                        $profile = HotspotProfile::createFromMicrotik($router, $result, Auth::user()->company_id, ConnectionTypeEnum::HOTSPOT->value);
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
