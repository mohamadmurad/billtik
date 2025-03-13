import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import {  useTranslation } from '@/hooks/useTranslation';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps){


    useTranslation();
    return (
       <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
           {children}
       </AppLayoutTemplate>
   );
}
