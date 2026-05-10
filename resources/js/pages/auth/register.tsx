import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registro de Cliente" />

            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Nuevo Cliente</h1>
                <p className="text-gray-500 font-medium">Completa tus datos para empezar a cuidar de tu mascota</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Nombre</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="rounded-2xl h-12 border-gray-200"
                            placeholder="Ej: Juan"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Apellidos</Label>
                        <Input
                            value={data.lastname}
                            onChange={(e) => setData('lastname', e.target.value)}
                            className="rounded-2xl h-12 border-gray-200"
                            placeholder="Ej: Pérez García"
                            required
                        />
                        {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Correo Electrónico</Label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="rounded-2xl h-12 border-gray-200"
                            placeholder="juan@ejemplo.com"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Teléfono</Label>
                        <Input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="rounded-2xl h-12 border-gray-200"
                            placeholder="600 000 000"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Dirección completa</Label>
                    <Input
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        className="rounded-2xl h-12 border-gray-200"
                        placeholder="Calle, Número, Ciudad..."
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Contraseña</Label>
                        <Input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="rounded-2xl h-12 border-gray-200"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Confirmar</Label>
                        <Input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="rounded-2xl h-12 border-gray-200"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        className="w-full bg-emerald-700 py-7 text-xl font-black hover:bg-emerald-800 rounded-2xl transition-all shadow-xl hover:scale-[1.01]"
                        disabled={processing}
                    >
                        {processing ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
                    </Button>
                </div>
            </form>

            <div className="mt-10 text-center text-base font-medium text-gray-600">
                ¿Ya eres cliente?{' '}
                <Link href="/login" className="text-emerald-700 font-bold hover:underline ml-1">
                    Inicia sesión aquí
                </Link>
            </div>
        </>
    );
}