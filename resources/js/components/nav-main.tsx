import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Users, ShieldCheck, LayoutGrid, } from 'lucide-react';

const iconMapping: Record<string, any> = {
    LayoutGrid: LayoutGrid,
    ShieldCheck: ShieldCheck,
    Users: Users,
};
export function NavMain({ items = [] }: { items: NavItem[] }) {

    return (
        <SidebarGroup className="px-2 py-0">
            {/*<SidebarGroupLabel>Platform</SidebarGroupLabel>*/}
            <SidebarMenu>
                {items.map((item) => {
                    let IconComponent = null;
                    if (item.icon){
                         IconComponent = iconMapping[item.icon] || LayoutGrid; // Default to LayoutGrid if icon not found
                    }
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.isActive}   tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <IconComponent />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
        ;
}
