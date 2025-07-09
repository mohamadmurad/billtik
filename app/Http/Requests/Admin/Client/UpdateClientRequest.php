<?php

namespace App\Http\Requests\Admin\Client;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
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
            'username' => ['required', 'string', Rule::unique('clients', 'username')->ignore($this->client)],
            'password' => ['required', 'string'],
            'name' => ['required', 'string'],
//            'name.en' => ['required', 'string'],
//            'name.ar' => ['required', 'string'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'id_number' => ['nullable', 'string'],
        ];
    }
}
