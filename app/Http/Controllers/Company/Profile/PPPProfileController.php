<?php

namespace App\Http\Controllers\Company\Profile;

use App\Enums\ConnectionTypeEnum;
use App\Http\Controllers\Admin\BaseCrudController;
use App\Http\Requests\Admin\Profile\StorePppProfileRequest;
use App\Models\Profile\PppProfile;
use App\Models\Profile\Profile;
use App\Models\Router;
use App\Services\MikroTikService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PPPProfileController extends BaseCrudController
{
    protected string $route = 'company.ppp.profiles';
    protected string $resource = 'ppp/profiles';
    protected string $model = PppProfile::class;
    protected string $storeRequestClass = StorePppProfileRequest::class;
    protected string $updateRequestClass = StorePppProfileRequest::class;

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
        $data['connection_type'] = ConnectionTypeEnum::PPP->value;
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

    public function syncItem(Request $request, PppProfile $profile): RedirectResponse
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
        $this->authorize('fetchAll', PppProfile::class);
        try {
            $errors = [];
            $routers = Router::byCompany(Auth::user()->company_id)->get();
            foreach ($routers as $router) {
                try {
                    $service = new MikroTikService($router);
                    $results = $service->getAllPPPProfiles();
                    foreach ($results as $result) {
                        if (!isset($result['.id'])) continue;
                        $profile = Profile::createFromMicrotik($router, $result, Auth::user()->company_id, ConnectionTypeEnum::PPP->value);
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
