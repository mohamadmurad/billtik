import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { t } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { Pagination } from '@/types/pagination';
import { ColumnDef } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

export default function MDatatable({
    items,
    resource,
    columns,
    withHeader = true,
    headerContent = null,
    afterCreateBtnContent = null,
    beforeCreateBtnContent = null,
    createBtnParentClassName = null,
    createButton = true,
    withSearch = true, // New prop to control search visibility
    searchDebounce = 500, // Debounce time in ms
    searchQueryKey = 'search', // Query parameter key for search
}: {
    items: Pagination;
    resource: string;
    withHeader?: boolean;
    headerContent?: null | ReactNode;
    createBtnParentClassName?: null | string;
    beforeCreateBtnContent?: null | ReactNode;
    afterCreateBtnContent?: null | ReactNode;
    columns: ColumnDef<never, never>[];
    createButton?: boolean;
    withSearch?: boolean; // New prop
    searchDebounce?: number; // New prop
    searchQueryKey?: string; // New prop
}) {
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, searchDebounce);

    // Initialize search value from URL query params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.href);
        const initialSearch = urlParams.get(searchQueryKey) || '';
        setSearchValue(initialSearch);
    }, [searchQueryKey]);
    // Handle search with debounce
    useEffect(() => {
        if (debouncedSearchValue !== null) {
            const url = new URL(window.location.href);

            if (debouncedSearchValue) {
                url.searchParams.set(searchQueryKey, debouncedSearchValue);
                // Reset to first page when searching
                //  url.searchParams.set('page', '1');
            } else {
                url.searchParams.delete(searchQueryKey);
                //   url.searchParams.delete('page');
            }

            router.visit(url.toString(), {
                preserveState: true,
                replace: true,
                only: ['items'], // Only refresh the items data
            });
        }
    }, [debouncedSearchValue, searchQueryKey]);
    const clearSearch = () => {
        setSearchValue('');
        const url = new URL(window.location.href);
        url.searchParams.delete(searchQueryKey);
        url.searchParams.delete('page');
        router.visit(url.toString(), {
            preserveState: true,
            replace: true,
            only: ['items'],
        });
    };
    return (
        <>
            {withHeader && (
                <div className="mb-5 flex items-center justify-between">
                    <div>{headerContent}</div>
                    <div className={cn('flex gap-2', createBtnParentClassName)}>
                        {beforeCreateBtnContent && beforeCreateBtnContent}
                        {createButton && (
                            <Link href={route(resource + '.create')}>
                                <Button variant="default" className="faateng-btn-primary px-8 py-5 text-[16px] font-extrabold">
                                    {t('attributes.create')} {t('attributes.' + resource + '.create_title')}
                                </Button>
                            </Link>
                        )}
                        {afterCreateBtnContent && afterCreateBtnContent}
                    </div>
                </div>
            )}
            {withSearch && (
                <div className="relative mt-2 mb-2 max-w-md">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                        placeholder={t('actions.search')}
                        className="pr-10 pl-10"
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
        </>
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
