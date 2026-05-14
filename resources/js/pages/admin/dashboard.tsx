import { Head, usePage } from '@inertiajs/react'; // Importamos usePage
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

export default function Dashboard() {
    const { auth } = usePage().props as any; 
    const staff = auth.user;

    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                        Bienvenido, {staff.name} {staff.lastname}
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Número de Colegiado: {staff.num_colegiado}
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <span className="font-semibold">Próximas Citas</span>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 -z-10" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <span className="font-semibold">Pacientes Nuevos</span>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 -z-10" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <span className="font-semibold">Tareas Pendientes</span>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 -z-10" />
                    </div>
                </div>
                
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-6">
                        <h2 className="text-lg font-medium">Actividad Reciente de la Clínica</h2>
                    </div>
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20 -z-10" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
    ],
};