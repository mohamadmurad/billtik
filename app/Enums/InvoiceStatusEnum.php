<?php

namespace App\Enums;

enum InvoiceStatusEnum: string
{
    case PAID = 'paid';
    case UNPAID = 'unpaid';

    public function meta(): array
    {
        switch ($this->value) {
            case InvoiceStatusEnum::PAID->value:
            {
                return [
                    'value' => $this->value,
                    'label' => __('attributes.paid'),
                    'bgColor' => 'bg-green-50 dark:bg-green-950/20',
                    'textColor' => 'text-green-700 dark:text-green-300',
                ];
            } case InvoiceStatusEnum::UNPAID->value:
            {
                return [
                    'value' => $this->value,
                    'label' => __('attributes.unpaid'),
                    'bgColor' => 'bg-green-50 dark:bg-green-950/20',
                    'textColor' => 'text-green-700 dark:text-green-300',
                ];
            }

            default:{
                return [
                    'value' => $this->value,
                    'label' => __('attributes.deactivate'),
                    'bgColor' => 'bg-green-50 dark:bg-green-950/20',
                    'textColor' => 'text-green-700 dark:text-green-300',
                ];
            }
        }
    }
}
