import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { t } from '@/hooks/useTranslation';
import { router } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface ActionProps {
    id: number;
    resource: string;
    disabled?: boolean;
}

export default function DeletePopover({ id, resource, disabled = false }: ActionProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const isOpen = deleteId === id;
    const handleDelete = () => {
        if (deleteId !== null) {
            onDelete(deleteId);
            setDeleteId(null); // Close popover after delete
        }
    };
    const onDelete = (id: number | null) => {
        if (!id) return;

        try {
            router.delete(route(resource + '.destroy', id));
        } catch (error) {
            console.error(`Failed to delete ${resource}:`, error);
        }
    };
    return (
        <Popover open={isOpen} onOpenChange={(open) => setDeleteId(open ? id : null)}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(id);
                    }}
                    disabled={disabled}
                >
                    <Trash2Icon size={20} className="text-red-500" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <p className="text-sm text-gray-700">{t('messages.delete_alert')}</p>
                <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
                        {t('attributes.cancel')}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        {t('attributes.delete')}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
