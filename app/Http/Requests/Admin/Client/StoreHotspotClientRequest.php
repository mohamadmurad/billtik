<?php

namespace App\Http\Requests\Admin\Client;

use App\Enums\ConnectionTypeEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreHotspotClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'router_id' => ['required', Rule::exists('routers', 'id')->where('company_id', $this->user()->company_id)],
            'profile_id' => ['required', Rule::exists('profiles', 'id')->where('company_id', $this->user()->company_id)
                ->where('router_id', $this->input('router_id'))],
            'name' => ['required', 'string'],
//            'name.en' => ['required', 'string'],
//            'name.ar' => ['required', 'string'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'mikrotik_username' => ['required', 'string',Rule::unique('clients', 'mikrotik_username')
                ->where('company_id', $this->user()->company_id)
                ->where('connection_type', ConnectionTypeEnum::PPP->value)
                ->where('router_id', $this->input('router_id'))
                ->whereNull('deleted_at')
            ],
            'mikrotik_password' => ['required', 'string'],
            'id_number' => ['nullable', 'string'],

        ];
    }
}
