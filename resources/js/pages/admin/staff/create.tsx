import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateStaff() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        lastname: '',
        email: '',
        password: '',
        num_colegiado: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/staff');
    };

    return (
        <>
            <Head title="Nuevo Trabajador" />

            <div className="flex h-full flex-1 flex-col p-4 md:p-6 items-center justify-center">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mt-2">
                        Alta de nuevo trabajador
                    </h1>
                </div>

                <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nombre</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800" />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Apellido</label>
                                <input type="text" value={data.lastname} onChange={(e) => setData('lastname', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800" />
                                {errors.lastname && <p className="text-xs text-red-500 mt-1">{errors.lastname}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nº Colegiado</label>
                            <input type="text" value={data.num_colegiado} onChange={(e) => setData('num_colegiado', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Contraseña</label>
                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800" />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                            >
                                {processing ? 'Registrando...' : 'Guardar trabajador'}
                            </button>

                            <Link
                                href="/admin/staff"
                                className="flex-1 rounded-lg border border-red-200 bg-red-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700 transition-colors"
                            >
                                Cancelar
                            </Link>
                        </div>
                            
                    </form>
                </div>
            </div>
        </>
    );
}

CreateStaff.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Staff', href: '/admin/staff' },
        { title: 'Nuevo', href: '/admin/staff/create' },
    ],
};