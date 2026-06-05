import { Head, usePage, useForm, router } from '@inertiajs/react';
import { Paperclip, Stethoscope, User, Dog, Lock } from 'lucide-react';

export default function MedicalRecordsCreate() {
    const { record, isEdit, appointment_id, appointment_data } = usePage().props as any;

    const { data, setData, post, put, processing } = useForm({
        pet_id: record?.pet_id || appointment_data?.pet_id || '',
        staff_id: record?.staff_id || appointment_data?.staff_id || '',
        record_type_id: record?.record_type_id || appointment_data?.record_type_id || '',
        appointment_id: appointment_id || '',
        diagnosis: record?.diagnosis || '',
        status: record?.status || 'abierta',
        file: null as File | null,
    });

    const isClosed = data.status === 'cerrada';

    const handleSubmit = (e: React.FormEvent | null, statusToSet?: string) => {
        if (e) e.preventDefault();
        if (statusToSet) setData('status', statusToSet);

        const url = isEdit ? `/admin/medical-records/${record.id}` : '/admin/medical-records';
        
        const options = {
            forceFormData: true,
            onSuccess: () => { window.location.href = '/admin/dashboard'; }
        };

        if (statusToSet) {
            setTimeout(() => { isEdit ? put(url, options) : post(url, options); }, 100);
        } else {
            isEdit ? put(url, options) : post(url, options);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
            <Head title={isEdit ? "Editar Informe" : "Nuevo Informe"} />
            
            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                            <Stethoscope className="w-7 h-7 text-emerald-600" />
                            {isClosed ? 'Informe Médico Cerrado' : (isEdit ? 'Editar Informe Médico' : 'Redactar Informe Médico')}
                        </h1>
                        
                        {!isClosed && (
                            <button 
                                type="button"
                                onClick={() => handleSubmit(null as any, 'cerrada')}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
                            >
                                <Lock className="w-4 h-4" /> Cerrar Informe
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
                            <Dog className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Paciente</p>
                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{appointment_data?.pet_name || 'No disponible'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
                            <User className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Veterinario</p>
                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{appointment_data?.staff_name || 'No disponible'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <fieldset disabled={isClosed} className="space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
                                Diagnóstico Detallado y Plan de Tratamiento
                            </label>
                            <textarea
                                rows={8}
                                value={data.diagnosis}
                                onChange={(e) => setData('diagnosis', e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:border-neutral-700 dark:bg-neutral-800 text-neutral-900 dark:text-white text-base shadow-inner disabled:opacity-70"
                                placeholder="Describe detalladamente los hallazgos clínicos, observaciones y el tratamiento recetado..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
                                Documentación clínica adjunta
                            </label>
                            
                            {record?.attachments && record.attachments.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {record.attachments.map((file: any) => (
                                        <div key={file.id} className="flex items-center justify-between gap-4 p-4 border border-emerald-200 bg-emerald-50 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <Paperclip className="w-5 h-5 text-emerald-600" />
                                                <a href={`/storage/${file.file_path}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-emerald-700 underline">
                                                    {file.file_name}
                                                </a>
                                            </div>
                                            {!isClosed && (
                                                <button
                                                    type="button"
                                                    onClick={() => router.delete(`/admin/attachments/${file.id}`)}
                                                    className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isClosed && (
                                <div className="relative group">
                                    <input 
                                        type="file" 
                                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex items-center gap-4 px-6 py-6 border-2 border-dashed border-neutral-200 rounded-xl group-hover:border-emerald-500 transition-all bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700">
                                        <Paperclip className="w-8 h-8 text-emerald-600" />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                                                {data.file ? data.file.name : "Subir nuevo archivo"}
                                            </p>
                                            <p className="text-xs text-neutral-400">Haz clic o arrastra para añadir</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </fieldset>

                    {!isClosed && (
                        <div className="flex justify-end gap-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                            <button type="button" onClick={() => window.history.back()} className="px-6 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md flex items-center gap-2">
                                {processing ? 'Procesando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}