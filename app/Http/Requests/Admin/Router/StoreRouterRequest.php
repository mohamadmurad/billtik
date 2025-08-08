<?php

namespace App\Http\Requests\Admin\Router;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreRouterRequest extends FormRequest
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
            'company_id' => ['required', 'exists:companies,id'],
            'name' => ['required', 'string'],
            'ip' => ['required', 'ip', Rule::unique('routers')
                ->where('port', $this->port)
                ->where('company_id', $this->company_id)
            ],
            'port' => ['required', 'numeric', Rule::unique('routers')
                ->where('ip', $this->ip)
                ->where('company_id', $this->company_id)
            ],
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }
}
