import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Animals() {
    const { animals } = usePage().props as any;
    const list = animals?.data || [];
    
    const [search, setSearch] = useState('');
    const filteredAnimals = list.filter((animal: any) => 
        animal.name.toLowerCase().includes(search.toLowerCase()) ||
        animal.chip_number.toLowerCase().includes(search.toLowerCase()) ||
        animal.owner?.name?.toLowerCase().includes(search.toLowerCase())
    ) || [];

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
                    
                    <div className="relative max-w-xs w-full">
                        <input
                            type="text"
                            placeholder="Buscar animal, chip o dueño..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
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
                                {filteredAnimals.length > 0 ? (
                                    filteredAnimals.map((animal: any) => (
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
                                                <button className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
                                                    Ver ficha
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        {/* Ahora abarca las 8 columnas reales para que no se descuadre */}
                                        <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-400 italic">
                                            No se encontraron animales registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        <div className="flex justify-center gap-2 p-4">
                            {animals.links.map((link: any, index: number) => {
                                let label = link.label;
                                const isArrow = index === 0 || index === animals.links.length - 1;
                                
                                if (index === 0) label = '<';
                                if (index === animals.links.length - 1) label = '>';

                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 border rounded text-xs transition-colors flex items-center justify-center ${
                                            link.active 
                                                ? 'bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900' 
                                                : 'bg-white text-neutral-600 dark:bg-neutral-800 hover:bg-neutral-100'
                                        } ${
                                            isArrow 
                                                ? 'bg-neutral-800 text-white border-neutral-800'
                                                : ''
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
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