import { Head, usePage, useForm } from '@inertiajs/react'; 
import { Calendar, Users, ClipboardList, Activity, FileText, X } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
    const { auth, stats, recentActivity } = usePage().props as any; 
    const staff = auth.user;

    // Estado para manejar el modal del informe
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    // Formulario de Inertia mapeado con las columnas de tu tabla medical_records
    const { data, setData, post, processing, errors, reset } = useForm({
        pet_id: '',
        staff_id: staff.id, // Se asigna automáticamente el staff logueado
        record_type_id: '',  // Puedes cambiarlo por un select si tienes tipos de registro
        diagnosis: '',
        status: 'completado', // Estado inicial por defecto
    });

    // Función para validar si el botón debe estar activo (Frontend fallback)
    // Nota: Funciona de forma óptima si activity.date viene en formato estándar (ej: YYYY-MM-DD HH:mm:ss)
    const isReportWindowActive = (appointmentDateStr: string) => {
        const appointmentDate = new Date(appointmentDateStr);
        const now = new Date();
        
        // 24 horas después de la cita
        const deadline = new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000); 

        return now >= appointmentDate && now <= deadline;
    };

    const openReportModal = (activity: any) => {
        setSelectedAppointment(activity);
        setData({
            pet_id: activity.pet_id, // Asegúrate de mandar el id de la mascota desde el Backend
            staff_id: staff.id,
            record_type_id: '1',     // Valor por defecto o dinámico
            diagnosis: '',
            status: 'completado',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cambia '/admin/medical-records' por la ruta correspondiente en tu Web.php
        post('/admin/medical-records', {
            onSuccess: () => closeModal(),
        });
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

                {/* Grid de Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Próximas Citas</span>
                            <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                                {stats?.proximas_citas ?? 0}
                            </span>
                            <span className="text-xs text-neutral-500">agendadas</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pacientes Nuevos</span>
                            <Users className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                                {stats?.pacientes_nuevos ?? 0}
                            </span>
                            <span className="text-xs text-neutral-500">últimos 7 días</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Atendidos / Pasados</span>
                            <ClipboardList className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                                {stats?.tareas_pendientes ?? 0}
                            </span>
                            <span className="text-xs text-neutral-500">registros totales</span>
                        </div>
                    </div>
                </div>
                
                {/* Tabla/Lista de últimas citas */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-neutral-500" />
                        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                            Últimas Citas Registradas
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        {recentActivity && recentActivity.length > 0 ? (
                            <div className="space-y-6">
                                {recentActivity.map((activity: any) => {
                                    // Comprobamos si está en el rango de tiempo permitido
                                    const canWriteReport = isReportWindowActive(activity.date);

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
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-0.5">
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            <span className="font-semibold">Motivo:</span> {activity.reason}
                                                        </p>
                                                        <span className="inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                                            {activity.staff_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Sección de Fecha y Botón de Informe */}
                                            <div className="flex items-center gap-3 self-end sm:self-center">
                                                <div className="text-right shrink-0">
                                                    <p className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                                                        {activity.date}
                                                    </p>
                                                </div>
                                                
                                                <button
                                                    onClick={() => openReportModal(activity)}
                                                    disabled={!canWriteReport}
                                                    title={canWriteReport ? "Redactar informe médico" : "El informe solo está disponible desde la hora de la cita hasta 24 horas después"}
                                                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors
                                                        ${canWriteReport 
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
                                                            : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    Informe
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-400 italic text-center py-4">
                                No hay actividad de citas registrada para este usuario.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL PARA REALIZAR EL INFORME (MEDICAL RECORD) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                                    Nuevo Informe Médico
                                </h3>
                                <p className="text-xs text-neutral-500">
                                    Paciente: {selectedAppointment?.pet_name}
                                </p>
                            </div>
                            <button onClick={closeModal} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            {/* Record Type ID */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Tipo de Registro (record_type_id)
                                </label>
                                <select
                                    value={data.record_type_id}
                                    onChange={e => setData('record_type_id', e.target.value)}
                                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                    required
                                >
                                    <option value="">Selecciona tipo...</option>
                                    <option value="1">Consulta General</option>
                                    <option value="2">Urgencia</option>
                                    <option value="3">Vacunación</option>
                                    <option value="4">Cirugía</option>
                                </select>
                                {errors.record_type_id && <span className="text-xs text-red-500">{errors.record_type_id}</span>}
                            </div>

                            {/* Diagnosis */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Diagnóstico / Observaciones (diagnosis)
                                </label>
                                <textarea
                                    value={data.diagnosis}
                                    onChange={e => setData('diagnosis', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 placeholder-neutral-400"
                                    placeholder="Escribe el diagnóstico médico detallado..."
                                    required
                                />
                                {errors.diagnosis && <span className="text-xs text-red-500">{errors.diagnosis}</span>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Estado (status)
                                </label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    <option value="completado">Completado</option>
                                    <option value="pendiente">Pendiente de Revisión</option>
                                </select>
                                {errors.status && <span className="text-xs text-red-500">{errors.status}</span>}
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Informe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Dashboard', href: '/admin/dashboard' },
    ],
};