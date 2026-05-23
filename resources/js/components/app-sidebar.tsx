import { Link } from '@inertiajs/react';
import { CircleUser, House, Dog } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Gestión clínica',
        href: '/admin/dashboard',
        icon: House,
    },
    {
        title: 'Gestión personal',
        href: '/admin/staff',
        icon: CircleUser,
    },
    {
        title: 'Pacientes',
        href: '/admin/animals',
        icon: Dog,
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="h-auto py-2" asChild>
                            <Link href="/admin/dashboard" prefetch className="flex items-center gap-4">
                                <div className="flex aspect-square size-16 shrink-0 items-center justify-center rounded-xl text-emerald-500 shadow-sm">
                                    <AppLogo /> 
                                </div>
                                
                                <div className="flex flex-col gap-1 leading-none group-data-[collapsible=icon]:hidden">
                                    <span className="font-bold text-neutral-100 text-xl tracking-tight">
                                        Tails & Paws
                                    </span>
                                    <span className="text-[11px] text-emerald-400 font-black uppercase tracking-widest">
                                        Admin System
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}