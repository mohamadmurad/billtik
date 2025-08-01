import { SidebarProvider } from '@/components/ui/sidebar';
import { FlashMessage, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar' | 'fullHeader';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }
    const { locale, flash } = usePage<SharedData>().props;

    const isRTL = locale == 'ar';

    useEffect(() => {
        if (!flash) return;
        const handleFlash = (flash: FlashMessage) => {
            if (!flash) return;
            console.log(flash);
            if (flash.success) toast.success(flash.success);
            if (flash.error) toast.error(flash.error);
            if (flash.errors_messages) {
                flash.errors_messages.forEach(function ($error) {
                    toast.error($error);
                });
            }
        };

        handleFlash(flash);
    }, [flash]);
    return (
        <SidebarProvider defaultOpen={isOpen} className={variant === 'fullHeader' ? 'flex h-screen flex-col' : ''}>
            {children}
            <ToastContainer rtl={isRTL} theme={'colored'} />
        </SidebarProvider>
    );
}
