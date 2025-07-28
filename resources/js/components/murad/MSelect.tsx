import InputError from '@/components/input-error';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface SearchableSelectProps {
    value?: string;
    onChange: (value: never) => void;
    apiUrl: string;
    placeholder?: string;
    label?: string;
    error?: string;
    hideLabel?: boolean;
    hideError?: boolean;
    inputProps?: InputProps;
}

export default function MSelect({
    value,
    onChange,
    apiUrl,
    placeholder = 'Search...',
    hideLabel = false,
    hideError = false,
    label,
    error,
    inputProps = {},
}: SearchableSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<never[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
    });
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const fetchOptions = async (page = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await axios.get(apiUrl, {
                params: {
                    search,
                    page,
                    per_page: pagination.per_page,
                },
            });

            setOptions(page === 1 ? response.data.results : [...options, ...response.data.results]);
            // setPagination({
            //     // current_page: response.data.current_page,
            //     // last_page: response.data.last_page,
            //     // per_page: response.data.per_page,
            // });
        } catch (error) {
            console.error('Error fetching options:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions(1, debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    // const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    //     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    //     const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
    //
    //     if (isNearBottom && !isLoading && pagination.current_page < pagination.last_page) {
    //         fetchOptions(pagination.current_page + 1, debouncedSearchTerm);
    //     }
    // };

    return (
        <>
            {!hideLabel && label && (
                <Label htmlFor={inputProps.id || inputProps.name} className="flex items-center gap-1">
                    {label} {inputProps.required && <span className="text-destructive text-sm leading-none dark:text-red-400">*</span>}
                </Label>
            )}
            <div className="space-y-2">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a router" />
                    </SelectTrigger>
                    <SelectContent>
                        <Input placeholder={placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-2" />
                        <ScrollArea className="h-64">
                            {options.map((option) => (
                                <SelectItem key={option.value} value={String(option.value)}>
                                    {option.label}
                                </SelectItem>
                            ))}
                            {isLoading && <div className="text-muted-foreground p-2 text-center text-sm">Loading more options...</div>}
                        </ScrollArea>
                    </SelectContent>
                </Select>
            </div>
            {!hideError && error && <InputError className="mt-2" message={error} />}
        </>

        // <Popover open={open} onOpenChange={setOpen}>
        //     <PopoverTrigger asChild>
        //         <Button
        //             variant="outline"
        //             role="combobox"
        //             aria-expanded={open}
        //             className="w-full justify-between"
        //         >
        //             {value ? options.find((option) => option.id === value)?.name : 'Select...'}
        //         </Button>
        //     </PopoverTrigger>
        //     <PopoverContent className="w-[400px] p-0">
        //         <Command shouldFilter={false}>
        //             <CommandInput
        //                 placeholder={placeholder}
        //                 value={searchTerm}
        //                 onValueChange={setSearchTerm}
        //             />
        //             <CommandList>
        //                 <CommandEmpty>No results found.</CommandEmpty>
        //                 <CommandGroup>
        //                     <ScrollArea className="h-64" onScroll={handleScroll}>
        //                         {options.map((option) => (
        //                             <CommandItem
        //                                 key={option.id}
        //                                 value={option.id}
        //                                 onSelect={() => {
        //                                     onChange(option.id);
        //                                     setOpen(false);
        //                                 }}
        //                             >
        //                                 {option.name}
        //                                 {option.ip && ` (${option.ip}:${option.port})`}
        //                             </CommandItem>
        //                         ))}
        //                         {isLoading && (
        //                             <CommandItem disabled>
        //                                 Loading...
        //                             </CommandItem>
        //                         )}
        //                     </ScrollArea>
        //                 </CommandGroup>
        //             </CommandList>
        //         </Command>
        //     </PopoverContent>
        // </Popover>
    );
}
