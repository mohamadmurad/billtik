import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, ShieldCheck, Users } from 'lucide-react';
import React from 'react';

const iconMapping: Record<string, React.ComponentType> = {
    LayoutGrid: LayoutGrid,
    ShieldCheck: ShieldCheck,
    Users: Users,
};

export function NavMain({ items = [] }: { items: NavItem[] }) {
    return (
        <>
            {items.map((item) => {
                return (
                    <SidebarGroup className="px-2 py-0">
                        {item.group_label && <SidebarGroupLabel>{item.group_label}</SidebarGroupLabel>}

                        <SidebarMenu>
                            {item.type === 'item' && <NavItem item={item} />}
                            {item.items && <NavItems items={item.items} />}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </>
    );
}

function NavItems({ items = [] }: { items: NavItem[] }) {
    return (
        <>
            {items.map((subItem) => {
                return <NavItem item={subItem} />;
            })}
        </>
    );
}

function NavItem({ item }: { item: NavItem }) {
    const IconComponent: React.ComponentType = iconMapping[item.icon as string] || LayoutGrid;
    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive} tooltip={{ children: item.title }}>
                <Link href={item.href} prefetch>
                    {item.icon && <IconComponent />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
