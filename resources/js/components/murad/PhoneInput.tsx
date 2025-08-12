import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import * as React from 'react';
import PhoneInputLib, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type InputProps = Omit<PhoneInputProps, 'onChange'> &
    Omit<React.ComponentProps<'input'>, 'onChange'> & {
        label?: string;
        error?: string;
        hideLabel?: boolean;
        hideError?: boolean;
        onChange?: (value: string, data?: any, event?: React.ChangeEvent<HTMLInputElement>, formattedValue?: string) => void;
    };
export default function PhoneInput({ className, label, error, country, onlyCountries, hideLabel = false, hideError = false, ...props }: InputProps) {
    return (
        <>
            {!hideLabel && label && (
                <Label htmlFor={props.id || props.name} className="flex items-center gap-1">
                    {label} {props.required && <span className="text-destructive text-sm leading-none dark:text-red-400">*</span>}
                </Label>
            )}
            <PhoneInputLib country={country} onlyCountries={onlyCountries} {...props} />
            {!hideError && error && <InputError className="mt-2" message={error} />}
        </>
    );
}
