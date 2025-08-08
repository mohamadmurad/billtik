<?php

namespace App\Http\Requests\Admin\Profile;

use App\Enums\ConnectionTypeEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePppProfileRequest extends FormRequest
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
            'router_id' => ['required', Rule::exists('routers', 'id')
                ->where('company_id', $this->user()->company_id)],
            'name' => ['required', 'array'],
            'name.en' => [
                'required',
                'string',

                Rule::unique('profiles', 'name->en')->where(function ($query) {
                    return $query->where('company_id', $this->user()->company_id)
                        ->where('connection_type', ConnectionTypeEnum::PPP->value)
                        ->where('router_id', $this->input('router_id'));
                })->ignore($this->profile) // Add this if updating
            ],
            'name.ar' => [
                'required',
                'string',
                // Custom unique check for Arabic name
                Rule::unique('profiles', 'name->ar')->where(function ($query) {
                    return $query->where('company_id', $this->user()->company_id)
                        ->where('connection_type', ConnectionTypeEnum::PPP->value)
                        ->where('router_id', $this->input('router_id'));
                })->ignore($this->profile) // Add this if updating
            ],
            'connection_type' => ['required', 'string', 'in:ppp,hotspot'],
            'upload_input' => ['required', 'numeric',],
            'upload_unit' => ['required', 'string', 'in:m,g,k'],
            'download_input' => ['required', 'numeric',],
            'download_unit' => ['required', 'string', 'in:m,g,k'],
            'price' => 'required|numeric|min:0'
        ];
    }
}
