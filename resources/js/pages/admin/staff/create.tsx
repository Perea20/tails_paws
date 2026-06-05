import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateStaff() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        lastname: '',
        email: '',
        password: '',
        role: 'veterinarian', 
        num_colegiado: '',
        shift: 'morning',     
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/staff');
    };

    return (
        <>
            <Head title="Nuevo Trabajador" />

            <div className="flex h-full flex-1 flex-col p-4 md:p-6 items-center justify-center bg-neutral-50/50 dark:bg-neutral-950">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mt-2">
                        Alta de nuevo trabajador
                    </h1>
                </div>

                <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <form onSubmit={submit} className="space-y-4">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nombre</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100" required />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Apellido</label>
                                <input type="text" value={data.lastname} onChange={(e) => setData('lastname', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100" required />
                                {errors.lastname && <p className="text-xs text-red-500 mt-1">{errors.lastname}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100" required />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Rol del trabajador</label>
                                <select 
                                    value={data.role} 
                                    onChange={(e) => setData('role', e.target.value)} 
                                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100"
                                    required
                                >
                                    <option value="veterinarian">Veterinario/a</option>
                                    <option value="reception">Recepción</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                            </div>
                        </div>

                        {data.role === 'veterinarian' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800/80 animate-in fade-in duration-200">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nº Colegiado</label>
                                    <input 
                                        type="text" 
                                        value={data.num_colegiado} 
                                        onChange={(e) => setData('num_colegiado', e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100" 
                                        required
                                    />
                                    {errors.num_colegiado && <p className="text-xs text-red-500 mt-1">{errors.num_colegiado}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Turno de Consulta</label>
                                    <select 
                                        value={data.shift} 
                                        onChange={(e) => setData('shift', e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100"
                                        required
                                    >
                                        <option value="morning">Mañana (09:00 hs - 13:30 hs)</option>
                                        <option value="afternoon">Tarde (16:00 hs - 20:30 hs)</option>
                                    </select>
                                    {errors.shift && <p className="text-xs text-red-500 mt-1">{errors.shift}</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-neutral-100/50 dark:bg-neutral-800/20 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 italic text-center">
                                    El rol asignado no realiza consultas veterinarias continuas. No requiere número de colegiado ni franja horaria de agenda.
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Contraseña</label>
                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100" required />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Registrando...' : 'Guardar trabajador'}
                            </button>

                            <Link
                                href="/admin/staff"
                                className="flex-1 rounded-lg border border-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 text-center px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
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