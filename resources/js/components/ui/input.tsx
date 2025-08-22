import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export type InputProps = React.ComponentProps<'input'> & {
    label?: React.ReactNode | string;
    error?: string;
    hideLabel?: boolean;
    hideError?: boolean;
};

function Input({ className, type, label, error, hideLabel = false, hideError = false, ...props }: InputProps) {
    const inputId = (props.id || props.name) as string | undefined;
    const errorId = inputId ? `${inputId}-error` : undefined;

    return (
        <>
            {!hideLabel && label && (
                <div className="mb-1 flex items-center justify-between gap-2">
                    <Label htmlFor={inputId} className="flex items-center gap-1">
                        {label}{' '}
                        {props.required && (
                            <span className="text-destructive dark:text-red-400 text-sm leading-none">*</span>
                        )}
                    </Label>
                    {!hideError && error && (
                        <span
                            id={errorId}
                            className="text-xs text-red-600 dark:text-red-400 ml-2 truncate"
                            title={error}
                        >
                            {error}
                        </span>
                    )}
                </div>
            )}
            <input
                type={type}
                data-slot="input"
                aria-invalid={!!error}
                aria-describedby={!hideError && error && errorId ? errorId : undefined}
                className={cn(
                    'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    className
                )}
                {...props}
            />
        </>

    );
}

export { Input };
