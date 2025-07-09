<?php

namespace App\Http\Requests\Admin\Client;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
            'name' => ['required', 'string'],
//            'name.en' => ['required', 'string'],
//            'name.ar' => ['required', 'string'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'username' => ['required', 'string', 'unique:clients'],
            'password' => ['required', 'string'],
            'id_number' => ['nullable', 'string'],
        ];
    }
}
