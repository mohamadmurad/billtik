import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';

import { Pagination } from '@/types/pagination';
import { t } from '@/hooks/useTranslation';
import { ColumnDef } from '@tanstack/react-table';

export default function MDatatable({ items, resource ,columns}: { items: Pagination, resource: string ,columns: ColumnDef<any,any>[]}) {

    return (
        <>
            <div className="flex justify-between mb-5">
                <div></div>
                <div className="">
                    <Link href={route(resource+'.create')}>
                        <Button variant="default" className="cursor-pointer">
                            {t('attributes.create')} {t('attributes.'+resource+'.title')}
                        </Button>
                    </Link>
                </div>
            </div>
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
                    total: items.total
                }} />
        </>
    );
}
