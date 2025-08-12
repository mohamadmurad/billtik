import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface Option {
    label: string;
    value: string | number;
}

interface ApiResponse {
    results: Option[];
    pagination: {
        more: boolean;
    };
}

interface SearchableSelectProps {
    value?: string;
    onChange: (value: string) => void;
    apiUrl: string;
    searchPlaceholder?: string;
    selectPlaceholder?: string;
    label?: string;
    error?: string;
    hideLabel?: boolean;
    hideError?: boolean;
    inputProps?: InputProps;
    dependencies?: Record<string, any>;
    allowClear?: boolean;
}

export default function MSelect({
    value,
    onChange,
    apiUrl,
    searchPlaceholder = 'Search...',
    selectPlaceholder = 'Select an option',
    hideLabel = false,
    hideError = false,
    label,
    error,
    inputProps = {},
    dependencies = {},
    allowClear = true,
}: SearchableSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchOptions = async (pageNumber = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>(apiUrl, {
                params: {
                    search,
                    page: pageNumber,
                    force_item_id: value && pageNumber === 1 && !search ? value : undefined,
                    ...dependencies,
                },
            });

            setOptions((prev) => (pageNumber === 1 ? response.data.results : [...prev, ...response.data.results]));
            setHasMore(response.data.pagination.more);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching options:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load - fetch selected item if value exists
    useEffect(() => {
        if (value && !initialLoadDone) {
            fetchOptions(1, '');
            setInitialLoadDone(true);
        }
    }, [value]);

    const loadMore = () => {
        if (!isLoading && hasMore) {
            fetchOptions(page + 1, searchTerm);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchOptions(1, debouncedSearchTerm);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [debouncedSearchTerm, isOpen, JSON.stringify(dependencies)]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setSearchTerm('');
            setPage(1);
        }
    };

    const selectedOptionLabel = options.find((opt) => String(opt.value) === value)?.label;

    const inputId = (inputProps.id || inputProps.name) as string | undefined;
    const errorId = inputId ? `${inputId}-error` : undefined;

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange('');
    };

    return (
        <>
            {!hideLabel && label && (
                <div className="mb-1 flex items-center justify-between gap-2">
                    <Label htmlFor={inputId} className="flex items-center gap-1">
                        {label} {inputProps.required && <span className="text-destructive text-sm leading-none dark:text-red-400">*</span>}
                    </Label>
                    {!hideError && error && (
                        <span id={errorId} className="ml-2 truncate text-xs text-red-600 dark:text-red-400" title={error}>
                            {error}
                        </span>
                    )}
                </div>
            )}
            <div className="relative">
                <Select value={value} onValueChange={onChange} onOpenChange={handleOpenChange} {...inputProps}>
                    <div className="relative">
                        <SelectTrigger
                            aria-invalid={!!error}
                            aria-describedby={!hideError && error && errorId ? errorId : undefined}
                            className={
                                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:border-ring focus-visible:ring-ring/50 mb-0 pr-8 focus-visible:ring-[3px]'
                            }
                        >
                            <SelectValue placeholder={selectPlaceholder}>{selectedOptionLabel}</SelectValue>
                        </SelectTrigger>
                        {allowClear && value && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 z-10 -translate-y-1/2"
                                aria-label="Clear selection"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <SelectContent>
                        <Input
                            ref={inputRef}
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-background sticky top-0 z-10 mb-2"
                        />
                        <ScrollArea className="h-64">
                            {options.length > 0 ? (
                                <>
                                    {options.map((option) => (
                                        <SelectItem key={option.value} value={String(option.value)}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                    {hasMore && (
                                        <div className="flex justify-center p-2">
                                            <Button variant="ghost" size="sm" onClick={loadMore} disabled={isLoading} className="w-full">
                                                {isLoading ? 'Loading...' : 'Load More'}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-muted-foreground p-4 text-center text-sm">{isLoading ? 'Loading...' : 'No options found'}</div>
                            )}
                        </ScrollArea>
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
