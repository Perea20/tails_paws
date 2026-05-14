import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StaffLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login'), {
            onFinish: () => reset('password'),
        };
    };

    return (
        <>
            <Head title="Iniciar Sesión - Staff" />

            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Bienvenido</h1>
                <p className="text-gray-500 font-medium">Introduce tus credenciales para acceder</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Correo Electrónico</Label>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="rounded-2xl h-12 border-gray-200 text-black" 
                        placeholder="tu@email.com"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs uppercase font-bold text-gray-400 ml-1">Contraseña</Label>
                    </div>
                    <Input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="rounded-2xl h-12 border-gray-200 text-black"
                        required
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password}</p>}
                </div>

                <div className="pt-4">
                    <Button
                        className="w-full bg-emerald-700 py-7 text-xl font-black text-white hover:bg-emerald-800 rounded-2xl transition-all shadow-xl hover:scale-[1.01]"
                        disabled={processing}
                    >
                        {processing ? 'ACCEDIENDO...' : 'INICIAR SESIÓN'}
                    </Button>
                </div>
            </form>

            <div className="mt-10 text-center text-base font-medium text-gray-600">
                ¿No eres staff?{' '}
                <Link href="/" className="text-emerald-700 font-bold hover:underline ml-1">
                    Volver al inicio
                </Link>
            </div>
        </>
    );
}