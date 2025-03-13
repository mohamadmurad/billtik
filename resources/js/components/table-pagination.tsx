import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PaginationInterface } from '@/types';
import { t } from '@/hooks/useTranslation';


export function TablePagination({ pagination }: { pagination: PaginationInterface }) {
    const { current_page, last_page, prev_page_url, next_page_url } = pagination;

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5; // Adjust based on how many pages you want visible

        if (last_page <= maxPagesToShow) {
            // Show all pages if they fit within maxPagesToShow
            for (let i = 1; i <= last_page; i++) pages.push(i);
        } else {
            // Always show first and last page
            pages.push(1);
            if (current_page > 3) pages.push('...');

            let start = Math.max(2, current_page - 1);
            let end = Math.min(last_page - 1, current_page + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (current_page < last_page - 2) pages.push('...');
            pages.push(last_page);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-between">
            <span className="text-muted text-sm">
                {t('pagination.showing')} {pagination.from}-{pagination.to} {t('pagination.from')} {pagination.total}
            </span>
            <div className="flex items-center justify-center space-x-2 pt-2">
                {/* Previous Button */}
                {prev_page_url && (
                    <Link href={prev_page_url}>
                        <Button variant="outline" size="sm">{t('pagination.previous')}</Button>
                    </Link>
                )}

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) =>
                    typeof page === 'number' ? (
                        <Link key={index} href={`?page=${page}`}
                              onClick={(e) => page == current_page && e.preventDefault()}>
                            <Button disabled={page === current_page}
                                    variant={page === current_page ? 'default' : 'outline'}
                                    size="sm"
                            >
                                {page}
                            </Button>
                        </Link>
                    ) : (
                        <span key={index} className="px-2">...</span>
                    )
                )}

                {/* Next Button */}
                {next_page_url && (
                    <Link href={next_page_url}>
                        <Button variant="outline" size="sm">{t('pagination.next')}</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
