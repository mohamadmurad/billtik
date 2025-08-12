import EditAction from '@/components/actions/EditAction';
import ShowAction from '@/components/actions/ShowAction';
import DeletePopover from '@/components/murad/DeletePopover';
import MDatatable from '@/components/murad/m-datatable';
import { Button } from '@/components/ui/button';
import { t } from '@/hooks/useTranslation';
import { type SharedData } from '@/types';
import { ProfileInterface } from '@/types/models';
import { Pagination } from '@/types/pagination';
import { router, usePage } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface ProfilesIndexContentProps {
  resource: string;
}

export default function ProfilesIndexContent({ resource }: ProfilesIndexContentProps) {
  const { items } = usePage<SharedData<{ items: Pagination }>>().props;
  const [isLoading, setIsLoading] = useState(false);

  function syncItem(id: number) {
    if (!id) return;
    try {
      setIsLoading(true);
      router.visit(route(resource + '.sync', id), {
        method: 'post',
        onFinish: () => setIsLoading(false),
      });
    } catch (error) {
      console.error(`Failed to sync ${resource}:`, error);
      setIsLoading(false);
    }
  }

  function syncAll() {
    try {
      setIsLoading(true);
      router.visit(route(resource + '.sync-all'), {
        method: 'post',
        onFinish: () => setIsLoading(false),
      });
    } catch (error) {
      console.error(`Failed to sync ${resource}:`, error);
      setIsLoading(false);
    }
  }

  return (
    <div className="px-4 py-6">
      <MDatatable
        items={items}
        createButton={true}
        beforeCreateBtnContent={
          <Button
            variant="default"
            className="px-8 py-5 text-[16px] font-extrabold"
            onClick={(e) => {
              e.stopPropagation();
              syncAll();
            }}
            disabled={isLoading}
          >
            <RefreshCw size={20} className="" />
            {t('attributes.fetch_from_microtik')}
          </Button>
        }
        resource={resource}
        columns={[
          {
            accessorKey: 'router.name',
            header: t('attributes.router'),
          },
          {
            accessorKey: 'name',
            header: t('attributes.name'),
          },
          {
            accessorKey: 'download_formatted',
            header: t('attributes.download_limit'),
          },
          {
            accessorKey: 'upload_formatted',
            header: t('attributes.upload_limit'),
          },
          {
            accessorKey: 'price_formatted',
            header: t('attributes.price'),
          },
          {
            accessorKey: 'created_at',
            header: t('attributes.created_at'),
          },
          {
            id: 'actions',
            header: t('attributes.actions'),
            cell: ({ row }: { row: Row<any> }) => {
              const rowModel = row.original as unknown as ProfileInterface;
              return (
                <div className="flex">
                  {rowModel.abilities.need_sync && (
                    <Button
                      title={t('attributes.sync')}
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        syncItem(rowModel.id);
                      }}
                      disabled={isLoading}
                    >
                      <RefreshCw size={20} className="text-green-500" />
                    </Button>
                  )}
                  {rowModel.abilities.view && <ShowAction resource={resource} rowModel={rowModel} disabled={isLoading} />}
                  {rowModel.abilities.edit && <EditAction rowModel={rowModel} resource={resource} disabled={isLoading} />}
                  {rowModel.abilities.delete && <DeletePopover id={rowModel.id} resource={resource} disabled={isLoading} />}
                </div>
              );
            },
          },
        ]}
      />
    </div>
  );
}