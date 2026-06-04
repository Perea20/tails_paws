import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateOwner() {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/owners');
    };

    return (
        <>
            <Head title="Nuevo Cliente" />
            
            <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm mt-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">
                            Paso 1: Registrar Dueño / Cliente
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Introduce los datos personales del cliente. Se le enviará un correo para activar su contraseña.
                        </p>
                    </div>
                    
                    <Link 
                        href="/admin/animals" 
                        className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline transition-colors"
                    >
                        Cancelar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Pepe"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-neutral-800 dark:text-neutral-100"
                            />
                            {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Apellidos *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Gonzalez Alonso"
                                value={data.lastname}
                                onChange={e => setData('lastname', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-neutral-800 dark:text-neutral-100"
                            />
                            {errors.lastname && <span className="text-xs text-red-500 mt-1 block">{errors.lastname}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Teléfono de Contacto *
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="Ej: 652 145 321"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-neutral-800 dark:text-neutral-100"
                            />
                            {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="Ej: example@gmail.com"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-neutral-800 dark:text-neutral-100"
                            />
                            {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Dirección
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: C/Las Sirenas"
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-neutral-800 dark:text-neutral-100"
                        />
                        {errors.address && <span className="text-xs text-red-500 mt-1 block">{errors.address}</span>}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800 mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition-colors focus:outline-none"
                        >
                            {processing ? 'Guardando...' : 'Siguiente: Registrar Mascota →'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateOwner.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Animales', href: '/admin/animals' },
        { title: 'Nuevo Cliente', href: '/admin/owners/create' },
    ],
};