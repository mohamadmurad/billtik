import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export default function InputError({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return (
        <p {...props} className={cn('min-h-[1.25rem] text-sm text-red-600 dark:text-red-400', className)} aria-live="polite" aria-atomic="true">
            {message}
        </p>
    );
}
