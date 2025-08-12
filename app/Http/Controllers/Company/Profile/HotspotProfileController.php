<?php

namespace App\Http\Controllers\Company\Profile;

use App\Enums\ConnectionTypeEnum;
use App\Http\Requests\Admin\Profile\StoreHotspotProfileRequest;
use App\Http\Requests\Admin\Profile\UpdateHotspotProfileRequest;
use App\Jobs\SendItemToMikrotik;
use App\Models\Profile\HotspotProfile;
use App\Models\Router;
use App\Services\Mikrotik\Hotspot\MikrotikHotspotProfileSerice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HotspotProfileController extends ProfileController
{
    protected string $route = 'company.hotspot.profiles';
    protected string $resource = 'hotspot/profiles';
    protected string $model = HotspotProfile::class;
    protected string $storeRequestClass = StoreHotspotProfileRequest::class;
    protected string $updateRequestClass = UpdateHotspotProfileRequest::class;


    protected function transformBeforeCreate(array $data): array
    {
        $data['company_id'] = $this->user->company_id;
        $data['connection_type'] = ConnectionTypeEnum::HOTSPOT->value;
        return $data;

    }

    public function syncItem(Request $request, HotspotProfile $profile): RedirectResponse
    {
        $this->authorize('sync', $profile);
        dispatch(new SendItemToMikrotik($profile));
        return redirect()->back()->with('success', __('messages.action_procing_taking_time'));
    }

    public function syncAll(Request $request): RedirectResponse
    {
        $this->authorize('fetchAll', HotspotProfile::class);
        try {
            $errors = [];
            $routers = Router::byCompany(Auth::user()->company_id)->get();
            foreach ($routers as $router) {
                try {
                    $service = new MikrotikHotspotProfileSerice($router);
                    $results = $service->get();
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


}
