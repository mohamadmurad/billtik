import { SidebarProvider } from '@/components/ui/sidebar';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const [isOpen, setIsOpen] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('sidebar') !== 'false' : true));

    const handleSidebarChange = (open: boolean) => {
        setIsOpen(open);

        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar', String(open));
        }
    };

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }
    const { locale } = usePage<SharedData>().props;

    const isRTL = locale == 'ar';
    return (
        <SidebarProvider defaultOpen={isOpen} open={isOpen} onOpenChange={handleSidebarChange}
                         dir={isRTL ? 'rtl' : 'ltr'}

        >
            {children}
        </SidebarProvider>
    );
}
