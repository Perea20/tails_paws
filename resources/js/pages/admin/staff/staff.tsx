import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Staff() {
    // Obtenemos los trabajadores y el usuario autenticado
    const { staff, auth } = usePage().props as any;
    const list = staff?.data || [];
    const user = auth?.user;

    const [search, setSearch] = useState('');
    const filteredStaff = list.filter((staff: any) => 
        staff.name.toLowerCase().includes(search.toLowerCase()) ||
        staff.email.toLowerCase().includes(search.toLowerCase()) ||
        staff.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Staff" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                            Personal de la Clínica
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Gestión de trabajadores.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative w-full sm:max-w-xs">
                            <input
                                type="text"
                                placeholder="Buscar nombre o email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                        </div>
                        
                        {user?.email === 'admin@admin.com' && (
                            <Link 
                                href="/admin/staff/create" 
                                className="whitespace-nowrap rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                            >
                                Alta Staff
                            </Link>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-500">
                            <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Apellido</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-3 py-4">Nº de Colegiado</th>
                                    <th className="px-6 py-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredStaff.map((staff: any) => (
                                    <tr key={staff.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                            {staff.name}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                            {staff.lastname}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                            {staff.email}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                            {staff.num_colegiado}
                                        </td>
                                        <td>
                                            <button className="text-emerald-600 hover:text-emerald-800 text-xs font-medium">
                                                    Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Staff.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Staff', href: '/admin/staff/staff' },
    ],
};