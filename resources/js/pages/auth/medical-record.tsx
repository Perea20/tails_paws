import { Link } from '@inertiajs/react';
import { Paperclip } from 'lucide-react';

export default function MedicalRecord({ appointment }: any) {
    const record = appointment.medical_record;
    const staff = appointment.staff;
    const recordType = appointment.record_type;

    return (
        <div className="bg-white min-h-screen text-neutral-800 w-full antialiased">
            <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6">

                <div className="flex justify-center pb-4 border-b border-neutral-100">
                    <Link href="/">
                        <img
                            src="/img/tplogotxt.png"
                            alt="Logo Tails & Paws"
                            className="h-30 w-auto"
                        />
                    </Link>
                </div>

                <Link
                    href="/profile"
                    className="text-emerald-600 mt-4 mb-4 block text-sm font-medium hover:underline"
                >
                    ← Volver al perfil
                </Link>

                <h1 className="text-2xl font-semibold text-neutral-900 mb-6">
                    Detalles de la Ficha Médica
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 border border-neutral-200 rounded-xl bg-white shadow-sm">
                        <p className="text-xs uppercase text-neutral-400 font-semibold">
                            Fecha y Hora
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            {appointment.date} {appointment.time}
                        </p>
                    </div>

                    <div className="p-4 border border-neutral-200 rounded-xl bg-white shadow-sm">
                        <p className="text-xs uppercase text-neutral-400 font-semibold">
                            Motivo
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            {recordType?.name || 'No especificado'}
                        </p>
                    </div>
                </div>

                <div className="p-4 border border-neutral-200 rounded-xl bg-white shadow-sm mb-4">
                    <p className="text-xs uppercase text-neutral-400 font-semibold">
                        Veterinario a cargo
                    </p>

                    <p className="mt-1 text-sm font-medium">
                        {staff?.name} {staff?.lastname}
                    </p>

                    <p className="text-sm text-neutral-500">
                        Nº Colegiado: {staff?.num_colegiado || 'N/A'}
                    </p>
                </div>

                <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">
                        Estado
                    </p>

                    <span className="inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                        {record?.status || 'Sin estado'}
                    </span>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">
                        Diagnóstico
                    </p>

                    <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50 text-sm leading-relaxed">
                        {record?.diagnosis || 'No hay diagnóstico registrado.'}
                    </div>
                </div>

                <div className="border-t border-neutral-200 pt-6">
                    <p className="text-sm font-semibold mb-3">
                        Documentación clínica adjunta
                    </p>

                    {record?.attachments?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {record.attachments.map((file: any) => (
                                <a
                                    key={file.id}
                                    href={`/storage/${file.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition"
                                >
                                    <Paperclip className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-700">
                                        Ver archivo adjunto
                                    </span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl text-center text-sm text-neutral-400">
                            No hay archivos adjuntos disponibles.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

MedicalRecord.layout = (page: any) => page;