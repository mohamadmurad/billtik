import InputError from '@/components/input-error';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

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
                                }: SearchableSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchOptions = async (pageNumber = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>(apiUrl, {
                params: {
                    search,
                    page: pageNumber,
                    force_item_id: value,
                    ...dependencies,
                },
            });

            setOptions(prev =>
                pageNumber === 1
                    ? response.data.results
                    : [...prev, ...response.data.results]
            );
            setHasMore(response.data.pagination.more);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching options:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        if (!isLoading && hasMore) {
            fetchOptions(page + 1, searchTerm);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (hasSearched || !value) {
                // Only fetch if user has searched before or no value is selected
                fetchOptions(1, debouncedSearchTerm);
            }
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setHasSearched(false);
        }
    }, [debouncedSearchTerm, isOpen, JSON.stringify(dependencies)]);

    useEffect(() => {
        if (searchTerm) {
            setHasSearched(true);
        }
    }, [searchTerm]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setSearchTerm('');
            setPage(1);
        } else {
            setSearchTerm('');
        }
    };

    const selectedOptionLabel = options.find(opt => String(opt.value) === value)?.label;

    return (
        <div className="space-y-2">
            {!hideLabel && label && (
                <Label htmlFor={inputProps.id || inputProps.name} className="flex items-center gap-1">
                    {label} {inputProps.required && <span className="text-destructive text-sm leading-none dark:text-red-400">*</span>}
                </Label>
            )}

            <Select
                value={value}
                onValueChange={onChange}
                onOpenChange={handleOpenChange}
                {...inputProps}
            >
                <SelectTrigger>
                    <SelectValue placeholder={selectPlaceholder}>
                        {selectedOptionLabel}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <Input
                        ref={inputRef}
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2 sticky top-0 bg-background z-10"
                    />
                    <ScrollArea className="h-64">
                        {options.length > 0 || value ? (
                            <>
                                {value && !options.some(opt => String(opt.value) === value) && (
                                    <SelectItem value={value} className="font-semibold">
                                        {selectedOptionLabel || 'Selected Item'}
                                    </SelectItem>
                                )}
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                                {hasMore && (
                                    <div className="flex justify-center p-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={loadMore}
                                            disabled={isLoading}
                                            className="w-full"
                                        >
                                            {isLoading ? 'Loading...' : 'Load More'}
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-muted-foreground p-4 text-center text-sm">
                                {isLoading ? 'Loading...' : 'No options found'}
                            </div>
                        )}
                    </ScrollArea>
                </SelectContent>
            </Select>

            {!hideError && error && <InputError className="mt-2" message={error} />}
        </div>
    );
}
