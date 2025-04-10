import { PermissionInterface, RoleInterface } from '@/types/models';
import type { Config } from 'ziggy-js';

export interface PaginationInterface {
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    from: number;
    to: number;
    per_page: number;
    total: number;
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: string | null;
    isActive?: boolean;
}

export type SharedData<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    name: string;
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    locale: string;
    translations: object;
    sidebar: NavItem[];
    [key: string]: unknown;
};

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    permissions: PermissionInterface[];
    roles: RoleInterface[];

    [key: string]: unknown; // This allows for additional properties...
}
