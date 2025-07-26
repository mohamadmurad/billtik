<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompanyStatusEnum;
use App\Http\Requests\Admin\Company\StoreCompanyRequest;
use App\Http\Requests\Admin\Profile\StoreProfileRequest;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Models\Company;
use App\Models\Profile;
use App\Models\Role;
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


    protected function customIndexQuery(Builder $query): Builder
    {
        return $query->filter()->byCompany($this->user->company_id);
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
            $service = new MikroTikService();
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

            $service = new MikroTikService();
            $rateLimit = $model->upload_input . $model->upload_unit . '/' . $model->download_input . $model->download_unit;
            $remoteId = $service->updatePPPProfile($model->microtik_id, [
                'name' => $model->name['en'],
                'rate-limit' => $rateLimit,
            ]);
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
            $service = new MikroTikService();
            $results = $service->getAllPPPProfiles();
            foreach ($results as $result) {
                if (!isset($result['.id']) || !isset($result['rate-limit'])) continue;

                $profile = Profile::createFromMicrotik($result, Auth::user()->company_id);
            }

            return redirect()->back()->with('success', __('messages.sync_success'));
        } catch (\Exception $exception) {
            return redirect()->back()->with('error', $exception->getMessage());
        }


    }

}
