import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

interface ActionProps {
    id: number;
    resource: string;
    disabled?: boolean;
    is_active?: boolean;
    className?: string;
    thumbClassName?: string;
}

export default function ToggleActive({ id, resource, is_active, className, thumbClassName, disabled = false }: ActionProps) {
    const handle = () => {
        onHandle(id);
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
        <div className="flex items-center space-x-2">
            <SwitchPrimitive.Root
                data-slot="switch"
                className={cn(
                    'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                checked={is_active}
                onCheckedChange={handle}
            >
                <SwitchPrimitive.Thumb
                    data-slot="switch-thumb"
                    className={cn(
                        'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
                        thumbClassName,
                    )}
                />
            </SwitchPrimitive.Root>
        </div>

        // <Popover open={isOpen} onOpenChange={(open) => setSelectedId(open ? id : null)}>
        //     <PopoverTrigger asChild>
        //         <Button
        //             variant="ghost"
        //             onClick={(e) => {
        //                 e.stopPropagation();
        //                 setSelectedId(id);
        //             }}
        //             disabled={disabled}
        //         >
        //             {is_active ? <X size={20} className="text-red-500" /> : <Check size={20} className="text-green-500" />}{' '}
        //         </Button>
        //     </PopoverTrigger>
        //     <PopoverContent className="w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        //         <p className="text-sm text-gray-700">{t('messages.delete_alert')}</p>
        //         <div className="mt-3 flex justify-end space-x-2">
        //             <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
        //                 {t('attributes.cancel')}
        //             </Button>
        //             <Button variant="destructive" size="sm" onClick={handle}>
        //                 {is_active ? t('attributes.disable') : t('attributes.active')}
        //             </Button>
        //         </div>
        //     </PopoverContent>
        // </Popover>
    );
}
