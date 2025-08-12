import InputError from '@/components/input-error';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputWithSelectProps {
    label?: string;
    inputProps?: InputProps;
    selectProps?: {
        value?: string;
        onValueChange?: (value: string) => void;
    };
    options?: { label: string; value: string }[];
    error?: string;
}

export default function InputWithSelect({ label, inputProps = {}, selectProps = {}, options = [], error }: InputWithSelectProps) {
    return (
        <div>
            {label && <Label htmlFor={inputProps.id || inputProps.name}>{label}</Label>}
            <div className="flex items-center gap-2">
                <Input {...inputProps} className={(inputProps.className ?? '') + ' flex-1'} />
                <select
                    className="border-input flex h-9 min-w-16 rounded-md border bg-transparent px-2 text-sm shadow-xs outline-none"
                    value={selectProps.value}
                    onChange={(e) => selectProps.onValueChange?.(e.target.value)}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <InputError className="mt-2" message={error} />
        </div>
    );
}
