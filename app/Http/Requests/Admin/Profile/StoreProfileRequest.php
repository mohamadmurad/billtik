<?php

namespace App\Http\Requests\Admin\Profile;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProfileRequest extends FormRequest
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
            'upload_input' => ['required', 'numeric',],
            'upload_unit' => ['required', 'string', 'in:m,g'],
            'download_input' => ['required', 'numeric',],
            'download_unit' => ['required', 'string', 'in:m,g'],
            'price' => 'required|numeric|min:0'
        ];
    }
}
