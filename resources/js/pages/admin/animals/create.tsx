import { Head, useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface CreateAnimalProps {
    owner_id: string | number;
    categories: Category[];
}

export default function CreateAnimal({ owner_id, categories }: CreateAnimalProps) {
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        chip_number: '',
        animal_category_id: categories[0]?.id || '', 
        gender: 'Macho',   
        birth_date: '',
        weight: '',
        height: '',
        client_id: owner_id || '', 
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/animals'); 
    };

    return (
        <>
            <Head title="Nueva Alta de Animal" />
            
            <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm mt-6">
                <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">
                    Registrar Nuevo Animal
                </h1>
                <p className="text-sm text-neutral-500 mb-6">
                    Introduce los datos médicos de la mascota. Se asociará automáticamente al dueño registrado.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nombre de la mascota</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nº de Chip</label>
                            <input
                                type="text"
                                value={data.chip_number}
                                onChange={e => setData('chip_number', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                            {errors.chip_number && <span className="text-xs text-red-500">{errors.chip_number}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Categoría / Especie</label>
                            <select
                                value={data.animal_category_id}
                                onChange={e => setData('animal_category_id', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:border-emerald-500"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.animal_category_id && <span className="text-xs text-red-500">{errors.animal_category_id}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Género</label>
                            <select
                                value={data.gender}
                                onChange={e => setData('gender', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:border-emerald-500"
                            >
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                            {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Fecha de nacimiento</label>
                            <input
                                type="date"
                                value={data.birth_date}
                                onChange={e => setData('birth_date', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500"
                            />
                            {errors.birth_date && <span className="text-xs text-red-500">{errors.birth_date}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Peso (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ej: 12.5"
                                value={data.weight}
                                onChange={e => setData('weight', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500"
                            />
                            {errors.weight && <span className="text-xs text-red-500">{errors.weight}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Altura (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Ej: 45"
                                value={data.height}
                                onChange={e => setData('height', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500"
                            />
                            {errors.height && <span className="text-xs text-red-500">{errors.height}</span>}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Guardando...' : 'Finalizar Alta'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}