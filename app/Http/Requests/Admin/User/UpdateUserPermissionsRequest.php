<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserPermissionsRequest extends FormRequest
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
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['nullable', 'numeric', 'exists:permissions,id'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['nullable', 'numeric', 'exists:roles,id'],
        ];
    }
}
