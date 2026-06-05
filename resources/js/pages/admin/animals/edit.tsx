import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Owner {
  name: string;
  email: string;
  phone?: string;
}

interface Pet {
  id: number;
  name: string;
  chip_number: string;
  gender: string;
  weight: number;
  height: number;
  animal_category_id: number; 
  category?: {
    id: number;
    name: string;
  };
  owner?: Owner;
}

interface Category {
  id: number;
  name: string;
}

interface EditProps {
  pet: Pet;
  categories: Category[];
}

export default function Edit({ pet, categories }: EditProps) {

  const [isEditing, setIsEditing] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    name: pet.name || '',
    chip_number: pet.chip_number || '',
    animal_category_id: pet.animal_category_id || (pet.category?.id || ''),
    gender: pet.gender || '',
    weight: pet.weight || 0,
    height: pet.height || 0,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(`/admin/animals/${pet.id}`, {
      onSuccess: () => {
        setIsEditing(false); 
      }
    });
  };

  const handleCancel = () => {
    reset(); 
    setIsEditing(false); 
  };

  return (
    <>
      <Head title={`Ficha de ${pet.name}`} />
      
      <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/animals" 
              className="p-2 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
            >
              ← Volver
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                Ficha Técnica: {pet.name}
              </h1>
              <p className="text-sm text-neutral-500">
                {isEditing ? 'Modificando la información del animal.' : 'Vista de información médica y registro.'}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-[38px] px-4 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors focus:outline-none"
            >
              Modificar Datos
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          
          {pet.owner && (
            <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl dark:bg-neutral-800/50 dark:border-neutral-800 mb-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Propietario asignado</span>
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{pet.owner.name}</div>
              <div className="text-xs text-neutral-500">{pet.owner.email} {pet.owner.phone ? `| ${pet.owner.phone}` : ''}</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 tracking-wider">Nombre del Animal</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 disabled:bg-neutral-50 dark:disabled:bg-neutral-800/50 disabled:text-neutral-500"
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 tracking-wider">Nº de Chip</label>
              <input
                type="text"
                value={data.chip_number}
                onChange={(e) => setData('chip_number', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 disabled:bg-neutral-50 dark:disabled:bg-neutral-800/50 disabled:text-neutral-500"
              />
              {errors.chip_number && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.chip_number}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 tracking-wider">Categoría / Especie</label>
              <select
                value={data.animal_category_id}
                onChange={(e) => setData('animal_category_id', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 capitalize disabled:bg-neutral-50 dark:disabled:bg-neutral-800/50 disabled:text-neutral-500"
                required
              >
                <option value="">Selecciona una especie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.animal_category_id && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.animal_category_id}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 tracking-wider">Género</label>
              <select
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 capitalize disabled:bg-neutral-50 dark:disabled:bg-neutral-800/50 disabled:text-neutral-500"
              >
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
                <option value="N/R">N/R</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 tracking-wider">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                value={data.weight}
                onChange={(e) => setData('weight', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 disabled:bg-neutral-50 dark:disabled:bg-neutral-800/50 disabled:text-neutral-500"
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase mb-2 tracking-wider">Altura (cm)</label>
              <input
                type="number"
                step="0.1"
                value={data.height}
                onChange={(e) => setData('height', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 disabled:bg-neutral-50 dark:disabled:bg-neutral-800/50 disabled:text-neutral-500"
              />
              {errors.height && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.height}</p>}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 inline-flex h-[42px] justify-center items-center rounded-lg border border-neutral-300 text-neutral-700 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 transition-colors focus:outline-none dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 inline-flex h-[42px] justify-center items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors focus:outline-none disabled:opacity-50"
              >
                {processing ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

Edit.layout = {
  breadcrumbs: [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Animales', href: '/admin/animals' },
    { title: 'Ver Ficha', href: '#' },
  ],
};