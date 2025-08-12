import InputError from '@/components/input-error';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

interface Option {
    value: string;
    label: string;
}

interface InputWithSelectProps {
    inputProps?: InputProps;
    selectProps?: React.ComponentProps<typeof SelectPrimitive.Root>;
    options: Option[];
    selectPlaceholder?: string;
    className?: string;
    label?: string;
    error?: string;
    hideLabel?: boolean;
    hideError?: boolean;
}

export default function InputWithSelect({
    inputProps = {},
    selectProps = {},
    options,
    selectPlaceholder = 'Unit',
    className = '',
    hideLabel = false,
    hideError = false,
    label,
    error,
}: InputWithSelectProps) {
    return (
        <>
            {!hideLabel && label && (
                <Label htmlFor={inputProps.id || inputProps.name} className="flex items-center gap-1">
                    {label} {inputProps.required && <span className="text-destructive text-sm leading-none dark:text-red-400">*</span>}
                </Label>
            )}
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="relative flex-1">
                    <Input type={inputProps?.type} {...inputProps} />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <Select {...selectProps}>
                            <SelectTrigger className="bg-background h-full rounded-l-none border-l px-3 py-0">
                                <SelectValue placeholder={selectPlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            {!hideError && <InputError className="mt-2" message={error} />}
        </>
    );
}
