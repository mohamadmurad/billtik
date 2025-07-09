import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

import { t } from '@/hooks/useTranslation';
import { Pagination } from '@/types/pagination';
import { ColumnDef } from '@tanstack/react-table';
import { ReactNode } from 'react';

export default function MDatatable({
    items,
    resource,
    columns,
    withHeader = true,
    headerContent = null,
    createButton = true,
}: {
    items: Pagination;
    resource: string;
    withHeader: boolean;
    headerContent: null | ReactNode;
    columns: ColumnDef<never, never>[];
    createButton?: boolean;
}) {
    return (
        <>
            {withHeader && (
                <div className="mb-5 flex items-center justify-between">
                    <div>{headerContent}</div>
                    <div className="">
                        {createButton && (
                            <Link href={route(resource + '.create')}>
                                <Button variant="default" className="faateng-btn-primary px-8 py-5 text-[16px] font-extrabold">
                                    {t('attributes.create')} {t('attributes.' + resource + '.create_title')}
                                </Button>
                            </Link>
                        )}
                    </div>
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
