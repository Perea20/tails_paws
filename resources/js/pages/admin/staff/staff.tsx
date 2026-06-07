import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Staff() {
    const { staff, auth } = usePage().props as any;
    
    const pagination = staff || {};
    const list = staff?.data || [];
    const user = auth?.user;

    const [search, setSearch] = useState('');
    
    const filteredStaff = list.filter((item: any) => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        (item.role && item.role.toLowerCase().includes(search.toLowerCase()))
    );

    const formatRole = (role: string) => {
        const roles: Record<string, string> = {
            admin: 'Administrador',
            reception: 'Recepción',
            veterinarian: 'Veterinario/a'
        };
        return roles[role] || role;
    };

    const formatShift = (shift: string) => {
        const shifts: Record<string, string> = {
            morning: '☀️ Mañana',
            afternoon: '🌙 Tarde'
        };
        return shifts[shift] || '—';
    };

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
                                placeholder="Buscar nombre, email o rol..."
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
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4">Nº de Colegiado</th>
                                    <th className="px-6 py-4">Turno</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                {item.lastname}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                {item.email}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                    item.role === 'admin' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                                    item.role === 'reception' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                    'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                }`}>
                                                    {formatRole(item.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                {item.num_colegiado || '—'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                {formatShift(item.shift)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-neutral-400 italic">
                                            No se han encontrado resultados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.links && pagination.links.length > 3 && (
                        <div className="flex items-center justify-center border-t border-neutral-100 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex gap-1">
                                {pagination.links.map((link: any, index: number) => {
                                    let label = link.label;
                                    
                                    if (index === 0) {
                                        label = '←';
                                    } else if (index === pagination.links.length - 1) {
                                        label = '→';
                                    }

                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                            }`}
                                            data={{ search }}
                                        >
                                            {label}
                                        </Link>
                                    ) : (
                                        <span
                                            key={index}
                                            className="cursor-not-allowed rounded-md px-3 py-1.5 text-xs font-medium text-neutral-300 dark:text-neutral-600"
                                        >
                                            {label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Staff.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Staff', href: '/admin/staff' },
    ],
};