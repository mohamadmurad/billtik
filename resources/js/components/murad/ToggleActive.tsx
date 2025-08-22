import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { t } from '@/hooks/useTranslation';
import { router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface ActionProps {
    id: number;
    resource: string;
    disabled?: boolean;
    is_active?: boolean;
}

export default function ToggleActive({ id, resource, is_active, disabled = false }: ActionProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const isOpen = selectedId === id;
    const handle = () => {
        if (selectedId !== null) {
            onHandle(selectedId);
            setSelectedId(null); // Close popover after delete
        }
    };
    const onHandle = (id: number | null) => {
        if (!id) return;

        try {
            router.post(route(resource + '.toggle-active', id));
        } catch (error) {
            console.error(`Failed to active ${resource}:`, error);
        }
    };
    return (
        <Popover open={isOpen} onOpenChange={(open) => setSelectedId(open ? id : null)}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(id);
                    }}
                    disabled={disabled}
                >
                    {is_active ? <X size={20} className="text-red-500" /> : <Check size={20} className="text-green-500" />}{' '}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <p className="text-sm text-gray-700">{t('messages.delete_alert')}</p>
                <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
                        {t('attributes.cancel')}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handle}>
                        {is_active ? t('attributes.disable') : t('attributes.active')}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
