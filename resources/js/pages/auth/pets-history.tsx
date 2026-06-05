import { Head, Link } from '@inertiajs/react';

export default function PetsHistory({ pet, appointments }: any) {
    return (
        <div className="bg-white min-h-screen text-neutral-800 antialiased py-12">
            <div className="max-w-4xl mx-auto px-6">
                <Head title={`Historial de ${pet.name}`} />
                
                <div className="mb-8">
                    <Link href="/profile" className="text-emerald-600 text-sm font-medium hover:underline">
                        ← Volver al perfil
                    </Link>
                    <h1 className="text-3xl font-light text-neutral-900 mt-2">Historial de {pet.name}</h1>
                    <p className="text-neutral-500 text-sm mt-1">Consulta el registro de todas las visitas de tu mascota.</p>
                </div>

                {appointments.data.length > 0 ? (
                    <div className="border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-600">
                                <tr>
                                    <th className="px-6 py-4 font-medium uppercase text-xs">Fecha</th>
                                    <th className="px-6 py-4 font-medium uppercase text-xs">Motivo</th>
                                    <th className="px-6 py-4 font-medium uppercase text-xs text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {appointments.data.map((app: any) => (
                                    <tr key={app.id} className="hover:bg-neutral-50/50">
                                        <td className="px-6 py-4">{new Date(app.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{app.record_type?.name || 'Sin motivo especificado'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={`/appointments/${app.id}/medical-record`}
                                                className="text-emerald-600 font-semibold text-xs uppercase hover:text-emerald-700"
                                            >
                                                Ver Ficha
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
                        <p className="text-neutral-400">Esta mascota aún no tiene citas registradas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}