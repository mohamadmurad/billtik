import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronUp, LayoutGrid, ShieldCheck, Users } from 'lucide-react';
import React from 'react';

const iconMapping: Record<string, React.ComponentType> = {
    LayoutGrid: LayoutGrid,
    ShieldCheck: ShieldCheck,
    Users: Users,
};

export function NavMain({ items = [] }: { items: NavItem[] }) {
    return (
        <>
            {items.map((item, index) => {
                return (
                    <SidebarGroup key={index} className="px-2 py-0">
                        {item.group_label && <SidebarGroupLabel className="text-[14px]">{item.group_label}</SidebarGroupLabel>}
                        <SidebarMenu>
                            <NavItems items={item.items ?? [item]} />
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
            {items.map((item) => {
                if (item.type === 'item') {
                    return <NavItem key={item.title} item={item} />;
                }

                if (item.type === 'collapsible' && item.items) {
                    return <NavCollapsibleItem key={item.title} item={item} />;
                }

                return null;
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

function NavCollapsibleItem({ item }: { item: NavItem }) {
    const IconComponent = iconMapping[item.icon as string] || LayoutGrid;
    const isAnyChildActive = item.items?.some((subItem) => subItem.isActive);
    return (
        <Collapsible key={item.title} className="group/collapsible" open={isAnyChildActive}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={{ children: item.title }}>
                        {item.icon && <IconComponent />}
                        <span>{item.title}</span>
                        <ChevronUp className="ml-auto transition-transform group-data-[state=closed]/collapsible:rotate-90 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) =>
                            subItem.type === 'item' ? (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuButton asChild isActive={subItem.isActive} tooltip={{ children: subItem.title }}>
                                        <Link href={subItem.href} prefetch>
                                            {subItem.icon && (
                                                <span className="mr-2">{React.createElement(iconMapping[subItem.icon] || LayoutGrid)}</span>
                                            )}
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuSubItem>
                            ) : null,
                        )}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>{' '}
        </Collapsible>
    );
}
