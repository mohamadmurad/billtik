import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { Pagination } from '@/types/pagination';
import { ColumnDef } from '@tanstack/react-table';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface MDatatableProps {
    items: Pagination;
    resource: string;
    columns: ColumnDef<never>[];
    // Header options
    withHeader?: boolean;
    headerContent?: ReactNode;
    // Create button options
    createButton?: boolean;
    createBtnParentClassName?: string|null;
    beforeCreateBtnContent?: ReactNode;
    afterCreateBtnContent?: ReactNode;
    // Search options
    withSearch?: boolean;
    searchDebounce?: number;
    searchQueryKey?: string;
    // Filter options
    filterComponents?: ReactNode;
    filtersActive?: boolean;
    onFilterApply?: () => void;
    onFilterReset?: () => void;
    // Additional customization
    className?: string;
    tableClassName?: string;
}

export default function MDatatable({
                                       items,
                                       resource,
                                       columns,
                                       // Header options
                                       withHeader = true,
                                       headerContent = null,
                                       // Create button options
                                       createButton = true,
                                       createBtnParentClassName = null,
                                       beforeCreateBtnContent = null,
                                       afterCreateBtnContent = null,
                                       // Search options
                                       withSearch = true,
                                       searchDebounce = 500,
                                       searchQueryKey = 'search',
                                       // Filter options
                                       filterComponents = null,
                                       filtersActive = false,
                                       onFilterApply,
                                       onFilterReset,
                                       // Additional customization
                                       className = '',
                                       tableClassName = '',
                                   }: MDatatableProps) {
    const [searchValue, setSearchValue] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const debouncedSearchValue = useDebounce(searchValue, searchDebounce);

    // Initialize search value from URL query params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearch = urlParams.get(searchQueryKey) || '';
        setSearchValue(initialSearch);
    }, [searchQueryKey]);

    // Handle search with debounce
    useEffect(() => {
        if (debouncedSearchValue !== null) {
            const url = new URL(window.location.href);

            if (debouncedSearchValue) {
                url.searchParams.set(searchQueryKey, debouncedSearchValue);
            } else {
                url.searchParams.delete(searchQueryKey);
            }

            router.visit(url.toString(), {
                preserveState: true,
                replace: true,
                only: ['items'],
            });
        }
    }, [debouncedSearchValue, searchQueryKey]);

    const clearSearch = () => {
        setSearchValue('');
        const url = new URL(window.location.href);
        url.searchParams.delete(searchQueryKey);
        router.visit(url.toString(), {
            preserveState: true,
            replace: true,
            only: ['items'],
        });
    };

    return (
        <div className={cn('space-y-4', className)}>
            {withHeader && (
                <div className="flex items-center justify-between">
                    <div>{headerContent}</div>
                    <div className={cn('flex gap-2', createBtnParentClassName)}>
                        {beforeCreateBtnContent}
                        {createButton && (
                            <Link href={route(resource + '.create')}>
                                <Button variant="default" className="px-8 py-5 text-[16px] font-extrabold">
                                    {t('attributes.create')} {t('attributes.' + resource + '.create_title')}
                                </Button>
                            </Link>
                        )}
                        {afterCreateBtnContent}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
                {withSearch && (
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                            placeholder={t('attributes.search')}
                            className="pl-10 pr-10"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        {searchValue && (
                            <button
                                onClick={clearSearch}
                                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}

                {filterComponents && (
                    <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                {t('attributes.filters')}
                                {filtersActive && (
                                    <Badge variant="default" className="h-5 w-5 p-0">
                                        !
                                    </Badge>
                                )}
                                {filtersOpen ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" align="end">
                            <div className="space-y-4">
                                {filterComponents}
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            onFilterReset?.();
                                            setFiltersOpen(false);
                                        }}
                                    >
                                        {t('attributes.reset')}
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            onFilterApply?.();
                                            setFiltersOpen(false);
                                        }}
                                    >
                                        {t('attributes.apply')}
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            <div className={cn('', tableClassName)}>
                <DataTable
                    columns={columns}
                    data={items.data}
                    pagination={{
                        current_page: items.current_page,
                        last_page: items.last_page,
                        prev_page_url: items.prev_page_url,
                        next_page_url: items.next_page_url,
                        from: items.from,
                        to: items.to,
                        per_page: items.per_page,
                        total: items.total,
                    }}
                />
            </div>
        </div>
    );
}

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
