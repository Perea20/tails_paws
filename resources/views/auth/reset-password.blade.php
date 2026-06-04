<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-neutral-900 text-neutral-100 flex items-center justify-center min-h-screen p-4">

    <div class="w-full max-w-md bg-neutral-800 rounded-xl border border-neutral-700 p-6 shadow-md">
        <h1 class="text-xl font-bold mb-2">Restablecer Contraseña</h1>
        <p class="text-sm text-neutral-400 mb-6">Introduce tu nueva contraseña para recuperar el acceso a tu cuenta.</p>

        @if ($errors->any())
            <div class="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-xs text-red-200">
                <ul class="list-disc pl-4">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('password.store') }}" method="POST" class="space-y-4">
            @csrf
            <input type="hidden" name="token" value="{{ request()->route('token') }}">

            <div>
                <label class="block text-sm font-medium text-neutral-300 mb-1">Correo Electrónico</label>
                <input type="email" name="email" value="{{ old('email', $email) }}" required
                    class="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
            </div>

            <div>
                <label class="block text-sm font-medium text-neutral-300 mb-1">Nueva Contraseña</label>
                <input type="password" name="password" required
                    class="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
            </div>

            <div>
                <label class="block text-sm font-medium text-neutral-300 mb-1">Confirmar Contraseña</label>
                <input type="password" name="password_confirmation" required
                    class="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
            </div>

            <div class="pt-2">
                <button type="submit" 
                    class="w-full inline-flex justify-center items-center rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors cursor-pointer">
                    Actualizar Contraseña
                </button>
            </div>
        </form>
    </div>

</body>
</html>