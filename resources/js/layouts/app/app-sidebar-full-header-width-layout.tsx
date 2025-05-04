import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarFullHeaderWidthLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
}>) {
    return (
        <AppShell variant="fullHeader">
            <AppSidebarHeader breadcrumbs={breadcrumbs} />

            <AppContent variant="fullHeader">
                <AppSidebar variant="fullHeader" />
                {children}
            </AppContent>
        </AppShell>
    );
}
