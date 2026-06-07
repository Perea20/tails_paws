import { Head, usePage, router, Link } from '@inertiajs/react'; 
import { Calendar, Users, ClipboardList, Activity, FileText, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const { auth, stats, recentActivity } = usePage().props as any; 
    const staff = auth.user;

    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const isReportWindowActive = (activity: any) => {
        if (!activity || !activity.date) return false;
        
        let standardizedDateStr = activity.date;
        if (activity.date.includes('/')) {
            const [datePart, timePart] = activity.date.split(' ');
            const [day, month, year] = datePart.split('/');
            standardizedDateStr = `${year}-${month}-${day}T${timePart || '00:00'}:00`;
        }

        const appointmentDate = new Date(standardizedDateStr);
        if (isNaN(appointmentDate.getTime())) return false;
    
        const deadline = new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000); 
    
        return currentTime >= appointmentDate.getTime() && currentTime <= deadline.getTime();
    };

    const handleNavigateToReport = (activityId: any) => {
        router.visit(`/admin/medical-records/${activityId}/edit`);
    };

    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 bg-neutral-50/50 dark:bg-neutral-950">

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                        Bienvenido, {staff.name} {staff.lastname}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Número de Colegiado: <span className="font-mono text-neutral-700 dark:text-neutral-300">{staff.num_colegiado}</span>
                        {staff.name === 'ADMIN' && (
                            <span className="ml-2 inline-flex items-center rounded-md bg-red-50 dark:bg-red-950/40 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                                Vista Global (Admin)
                            </span>
                        )}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Próximas Citas</span>
                            <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">{stats?.proximas_citas ?? 0}</span>
                            <span className="text-xs text-neutral-500">agendadas</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pacientes Nuevos</span>
                            <Users className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">{stats?.pacientes_nuevos ?? 0}</span>
                            <span className="text-xs text-neutral-500">últimos 7 días</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Atendidos / Pasados</span>
                            <ClipboardList className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">{stats?.tareas_pendientes ?? 0}</span>
                            <span className="text-xs text-neutral-500">registros totales</span>
                        </div>
                    </div>
                </div>
                
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-neutral-500" />
                        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Últimas Citas Registradas</h2>
                    </div>
                    
                    <div className="p-6">
                        {recentActivity && recentActivity.length > 0 ? (
                            <div className="space-y-6">
                                {recentActivity.map((activity: any) => {

                                    const canWriteReport = isReportWindowActive(activity);
                                    const [datePart, timePart] = activity.date.split(' ');
                                    const [day, month, year] = datePart.split('/');
                                    const appTime = new Date(`${year}-${month}-${day}T${timePart}`).getTime();
                                    const isFuture = appTime > currentTime;
                                    const showExpiredView = !canWriteReport && !isFuture;

                                    return (
                                        <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-50 dark:border-neutral-800/50 pb-4 last:border-0 last:pb-0 gap-4">
                                            <div className="flex gap-3 items-center">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold uppercase text-xs">
                                                    {activity.pet_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                                                        {activity.pet_name} <span className="text-neutral-400 font-normal">({activity.client_name})</span>
                                                    </p>
                                                    <p className="text-xs text-neutral-500">{activity.reason}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <p className="text-xs font-mono text-neutral-500">
                                                    {activity.date}
                                                </p>
                                                
                                                {showExpiredView ? (
                                                    <Link 
                                                        href={`/admin/medical-records/${activity.id}/edit`}
                                                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Ver Informe
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => handleNavigateToReport(activity.id)}
                                                        disabled={!canWriteReport}
                                                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors ${
                                                            canWriteReport 
                                                                ? 'bg-blue-600 hover:bg-blue-700' 
                                                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'
                                                        }`}
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        Informe
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-neutral-500 text-sm py-4">No hay actividad reciente.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Dashboard', href: '/admin/dashboard' },
    ],
};