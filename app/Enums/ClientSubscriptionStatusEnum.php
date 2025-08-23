<?php

namespace App\Enums;

enum ClientSubscriptionStatusEnum: string
{
    case ACTIVE = 'active';
    case PENDING = 'pending';
    case EXPIRED = 'expired';
    case CANCELLED = 'Cancelled';

    public function meta(): array
    {
        switch ($this->value) {
            case ClientSubscriptionStatusEnum::ACTIVE->value:
            {
                return [
                    'value' => $this->value,
                    'label' => __('attributes.active'),
                    'bgColor' =>  'bg-green-50 dark:bg-green-950/20',
                    'textColor' => 'text-green-700 dark:text-green-300',
                ];
            }
            case ClientSubscriptionStatusEnum::PENDING->value:
            {
                return [
                    'value' => $this->value,
                    'label' => __('attributes.pending'),
                    'bgColor' => 'bg-gray-50 dark:bg-gray-950/20',
                    'textColor' => 'text-gray-700 dark:text-gray-300',
                ];
            }
            case ClientSubscriptionStatusEnum::EXPIRED->value:
            {
                return [
                    'value' => $this->value,
                    'label' => __('attributes.expired'),
                    'bgColor' => 'bg-red-500/20 text-red-100',
                    'textColor' => 'text-gray-700 dark:text-gray-300',
                ];
            }
            case ClientSubscriptionStatusEnum::CANCELLED->value:
            {
                return [
                    'value' => $this->value,
                    'label' => __('attributes.cancelled'),
                    'bgColor' => 'bg-red-500/20 text-red-100',
                    'textColor' => 'text-gray-700 dark:text-gray-300',
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
