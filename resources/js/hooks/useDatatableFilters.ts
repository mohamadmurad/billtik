// hooks/useDatatableFilters.ts
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export function useDatatableFilters(initialFilters = {}, resource: string) {
    const [filters, setFilters] = useState(initialFilters);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Initialize filters from URL on first load
    useEffect(() => {
        if (isInitialLoad) {
            const urlParams = new URLSearchParams(window.location.search);
            const initialFiltersFromUrl = {};

            Object.keys(initialFilters).forEach(key => {
                if (urlParams.has(key)) {
                    initialFiltersFromUrl[key] = urlParams.get(key);
                }
            });

            setFilters(prev => ({ ...prev, ...initialFiltersFromUrl }));
            setIsInitialLoad(false);
        }
    }, [isInitialLoad, initialFilters]);

    const applyFilters = () => {
        // Clean up empty filters
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '' && value !== undefined)
        );

        router.get(route(resource + '.index', cleanedFilters), {
            preserveState: true,
            replace: true,
            only: ['items'], // Only refresh the items data
            onFinish: () => {
                // This prevents infinite loops
                window.history.replaceState({}, '', route(resource + '.index', cleanedFilters));
            }
        });
    };

    const resetFilters = () => {
        setFilters(initialFilters);
        router.get(route(resource + '.index'), {
            preserveState: true,
            replace: true,
            only: ['items'],
        });
    };

    const isFiltersActive = Object.entries(filters).some(
        ([key, value]) => value !== undefined && value !== '' && value !== initialFilters[key]
    );

    return {
        filters,
        setFilters,
        applyFilters,
        resetFilters,
        isFiltersActive,
    };
}
