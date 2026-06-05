import { Head, usePage, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Animals() {
    const { animals, auth } = usePage().props as any;
    
    const urlParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(urlParams.get('search') || '');

    const pagination = animals || {};
    const list = animals?.data || [];

    const isClinicAccount = auth?.user?.email === 'tailspawsclinic@gmail.com';

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(
                '/admin/animals',
                { 
                    search: search,
                    page: 1 
                },
                {
                    preserveState: true,
                    replace: true,
                    only: ['animals'], 
                }
            );
        }, 250);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <>
            <Head title="Animales" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                            Animales de la Clínica
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Listado completo de animales registrados, chips y medidas corporales.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:flex-1 sm:justify-end">
                        <div className="relative w-full sm:flex-1 sm:max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar animal, chip o dueño..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            />
                        </div>

                        {isClinicAccount && (
                            <Link
                                href="/admin/owners/create" 
                                className="inline-flex w-full sm:w-auto h-[38px] whitespace-nowrap justify-center items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                                Nueva alta
                            </Link>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Animal</th>
                                    <th className="px-6 py-4 font-semibold">Nº Chip</th>
                                    <th className="px-6 py-4 font-semibold">Categoría</th>
                                    <th className="px-6 py-4 font-semibold">Género</th>
                                    <th className="px-6 py-4 font-semibold">Edad</th>
                                    <th className="px-6 py-4 font-semibold">Peso / Altura</th>
                                    <th className="px-6 py-4 font-semibold">Propietario</th>
                                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {list.length > 0 ? (
                                    list.map((animal: any) => (
                                        <tr key={animal.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                                        {animal.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-base font-semibold">{animal.name}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 font-mono text-xs tracking-wider text-neutral-700 dark:text-neutral-300">
                                                {animal.chip_number}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 capitalize">
                                                    {animal.category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 capitalize">
                                                    {animal.gender}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-xs text-neutral-700 dark:text-neutral-300">
                                                {animal.age}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs text-neutral-600 dark:text-neutral-300">
                                                    <span><strong>Peso:</strong> {animal.weight}</span>
                                                    <span><strong>Altura:</strong> {animal.height}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {animal.owner ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-neutral-800 dark:text-neutral-200 font-medium">{animal.owner.name}</span>
                                                        <span className="text-xs text-neutral-400">{animal.owner.phone || animal.owner.email}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs italic text-amber-500">Sin dueño asignado</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={`/admin/animals/${animal.id}/edit`}
                                                    className="inline-flex items-center rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                                                >
                                                    Ver ficha
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-400 italic">
                                            No se encontraron animales registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.links && pagination.links.length > 3 && (
                        <div className="flex justify-center gap-1 p-4 border-t border-neutral-100 dark:border-neutral-800">
                            {pagination.links.map((link: any, index: number) => {
                                let label = link.label;
                                
                                if (index === 0) label = '←';
                                if (index === pagination.links.length - 1) label = '→';

                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                            link.active 
                                                ? 'bg-emerald-600 text-white' 
                                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                        }`}
                                        preserveState
                                    >
                                        {label}
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-md text-xs font-medium text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                                    >
                                        {label}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Animals.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Animales', href: '/admin/animals' },
    ],
};