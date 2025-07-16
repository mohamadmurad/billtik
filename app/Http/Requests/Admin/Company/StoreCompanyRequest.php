<?php

namespace App\Http\Requests\Admin\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreCompanyRequest extends FormRequest
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
            'name' => ['required', 'array'],
            'name.en' => ['required', 'string'],
            'name.ar' => ['required', 'string'],
            // user info
            'user' => ['required', 'array'],
            'user.name' => ['required', 'string'],
            'user.email' => ['required', 'email', 'unique:users,email'],
            'user.password' => ['required', new Password(8), 'confirmed'],
        ];
    }
}
