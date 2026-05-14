import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="py-4"> {/* Añadimos padding vertical al header */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* Aumentamos la altura del botón para que quepa el logo más grande */}
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}