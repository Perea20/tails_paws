import { Head, usePage, useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Profile() {
    const { client, myPets, categories } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        chip_number: '',
        animal_category_id: '',
        weight: '',
        height: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile/pet', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            }, 
        });
    };

    return (
        <>
            <Head title="Mi Perfil" />
            
            <div className="bg-white min-h-screen text-neutral-800 w-full antialiased selection:bg-emerald-100">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-12">
                    
                    <div className="flex justify-center pb-6 border-b border-neutral-100">
                        <Link href="/">
                            <img src="/img/tplogotxt.png" alt="Logo Tails & Paws" className="h-30 w-auto" />
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-8 border-b border-emerald-100 gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extralight tracking-tight text-neutral-900">
                                Mi Perfil
                            </h1>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-emerald-800/80">
                                <p><span className="text-neutral-400 font-normal">Propietario: </span> {client.name} {client.lastname}</p>
                                <p><span className="text-neutral-400 font-normal">Email: </span> {client.email}</p>
                                <p><span className="text-neutral-400 font-normal">Teléfono: </span> {client.phone || '—'}</p>
                                <p><span className="text-neutral-400 font-normal">Dirección: </span> {client.address || '—'}</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className="text-xs font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-sm shadow-emerald-100 transition-all duration-200 active:scale-95"
                        >
                            {showForm ? 'Cancelar' : 'Registrar Mascota'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-white rounded-xl p-8 border border-emerald-100 shadow-sm max-w-3xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 mx-auto">
                            <div className="mb-6">
                                <h3 className="text-lg font-normal text-emerald-900 tracking-tight">Nueva Mascota</h3>
                                <p className="text-sm text-neutral-400 font-light mt-0.5">Introduce los datos del animal para asociarlo a tu expediente.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-neutral-500">Nombre *</label>
                                        <input 
                                            type="text" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
                                            required 
                                        />
                                        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-neutral-500">Tipo de Animal *</label>
                                        <select 
                                            value={data.animal_category_id}
                                            onChange={e => setData('animal_category_id', e.target.value)}
                                            className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-150 appearance-none"
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {categories?.map((cat: any) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-neutral-500">Número de Chip</label>
                                        <input 
                                            type="text" 
                                            value={data.chip_number}
                                            onChange={e => setData('chip_number', e.target.value)}
                                            className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-medium text-neutral-500">Peso (kg)</label>
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                value={data.weight}
                                                onChange={e => setData('weight', e.target.value)}
                                                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-medium text-neutral-500">Altura (cm)</label>
                                            <input 
                                                type="number" 
                                                value={data.height}
                                                onChange={e => setData('height', e.target.value)}
                                                className="w-full px-3.5 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-3 border-t border-neutral-100">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors duration-150 disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Confirmar alta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h2 className="text-xl font-light tracking-tight text-neutral-900">
                            Mis mascotas registradas
                        </h2>

                        {myPets.length > 0 ? (
                            <div className="w-full overflow-hidden bg-white border border-emerald-100 rounded-xl shadow-sm">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-emerald-100 bg-emerald-50/40 text-emerald-800/80 text-xs font-semibold uppercase tracking-wider">
                                            <th className="px-6 py-3.5 font-medium">Nombre</th>
                                            <th className="px-6 py-3.5 font-medium">Especie / Tipo</th>
                                            <th className="px-6 py-3.5 font-medium">Nº Identificador (Chip)</th>
                                            <th className="px-6 py-3.5 font-medium text-right">Métricas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 text-neutral-600">
                                        {myPets.map((pet: any) => (
                                            <tr key={pet.id} className="hover:bg-emerald-50/10 transition-colors duration-150">
                                                <td className="px-6 py-4 font-normal text-neutral-950 text-base">
                                                    {pet.name}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-neutral-550">
                                                    {pet.category}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-neutral-400">
                                                    {pet.chip_number || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-right">
                                                    {pet.weight !== 'N/R' || pet.height !== 'N/R' ? (
                                                        <div className="flex justify-end gap-x-2 text-xs font-medium">
                                                            {pet.weight !== 'N/R' && <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md">{pet.weight} </span>}
                                                            {pet.height !== 'N/R' && <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md">{pet.height} </span>}
                                                        </div>
                                                    ) : (
                                                        <span className="text-neutral-300">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-16 text-center border border-dashed border-emerald-200 bg-white rounded-xl">
                                <p className="text-sm text-neutral-400 font-light italic">No tienes ningún animal registrado en tu cuenta actualmente.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

Profile.layout = (page: any) => page;