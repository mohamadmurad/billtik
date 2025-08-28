<?php

namespace App\Http\Requests\Company\Invoice;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'client_type' => ['required', 'in:ppp,hotspot'],
            'subscription_id' => ['nullable', 'integer', 'exists:client_subscriptions,id'],
            'profile_id' => ['nullable', 'integer', 'exists:profiles,id'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'discount_amount' => ['nullable', 'numeric', 'min:0'],
            'issue_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:issue_date'],
            'description' => ['nullable', 'string'],
        ];
    }
}

