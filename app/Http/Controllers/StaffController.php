<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail; 
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use App\Models\Appointment; 
use App\Models\Staff; 
use App\Models\Pet; 
use App\Models\Client; 
use App\Mail\NewClientMail;
use Carbon\Carbon;

class StaffController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/staff/staff', [
            'staff' => Staff::paginate(10),
        ]);
    }

    public function storeByStaff(Request $request)
    {
        $user = Auth::guard('staff')->user();
        
        if (!$user || $user->email !== 'tailspawsclinic@gmail.com') {
            abort(403, 'No tienes permisos para registrar clientes desde el mostrador.');
        }

        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:clients,email'],
            'phone'    => ['nullable', 'string', 'max:20'],
        ]);

        $client = Client::create([
            'name'     => $request->name,
            'lastname' => $request->lastname,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make(Str::random(32)), 
        ]);

        $token = Password::getRepository()->create($client);

        $activationUrl = route('password.reset', [
            'token' => $token,
            'email' => $client->email
        ]);

        Mail::to($client->email)->send(new NewClientMail($client, $activationUrl));

        return redirect()->back()->with('message', '¡Dueño registrado correctamente! Se ha enviado el correo de activación.');
    }

    public function dashboard()
    {
        $user = Auth::guard('staff')->user();

        if (!$user) {
            return redirect()->route('admin.login');
        }

        if ($user->email === 'admin@admin.com') {
            $appointments = Appointment::with(['pet', 'client', 'staff'])
                ->orderBy('date', 'asc')
                ->orderBy('time', 'asc')
                ->get();
        } else {
            $appointments = Appointment::with(['pet', 'client', 'staff'])
                ->where('staff_id', $user->id) 
                ->orderBy('date', 'asc')
                ->orderBy('time', 'asc')
                ->get();
        }

        $proximasCitasCount = 0;
        $citasPasadasCount = 0;

        foreach ($appointments as $app) {
            $appointmentDateTime = Carbon::parse($app->date . ' ' . $app->time);

            if ($appointmentDateTime->isPast()) {
                $citasPasadasCount++;
            } else {
                $proximasCitasCount++;
            }
        }

        $pacientesNuevosCount = Pet::where('created_at', '>=', now()->subDays(7))->count();

        $recentActivity = $appointments->take(5)->map(function($app) {
            return [
                'id' => $app->id,
                'pet_name' => $app->pet?->name ?? 'Mascota',
                'client_name' => $app->client?->name ?? 'Cliente',
                'staff_name' => $app->staff ? 'Dr/a. ' . $app->staff->name . ' ' . $app->staff->lastname : 'Sin asignar',
                'date' => Carbon::parse($app->date . ' ' . $app->time)->format('d/m/Y H:i'), 
                'reason' => $app->reason ?? 'Consulta general',
            ];
        });

        return Inertia::render('admin/dashboard', [
            'appointments' => $appointments,
            'stats' => [
                'proximas_citas' => $proximasCitasCount,
                'pacientes_nuevos' => $pacientesNuevosCount,
                'tareas_pendientes' => $citasPasadasCount, 
            ],
            'recentActivity' => $recentActivity
        ]);
    }

    public function createStaff()
    {
        if (Auth::guard('staff')->user()->email !== 'admin@admin.com') {
            abort(403, 'No tienes permisos para registrar nuevo personal.');
        }

        return Inertia::render('admin/staff/create');
    }

    /**
     * PROCESO DE GUARDADO CON ROLES Y TURNOS DINÁMICOS
     */
    public function storeStaff(Request $request)
    {
        if (Auth::guard('staff')->user()->email !== 'admin@admin.com') {
            abort(403, 'No tienes permisos para realizar esta acción.');
        }

        // Validación dinámica condicional
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:staff,email'], 
            'password' => ['required', 'string'],
            'role' => ['required', 'in:admin,reception,veterinarian'],
            // Si el rol es veterinario, el número de colegiado y el turno pasan a ser estrictamente obligatorios
            'num_colegiado' => [$request->role === 'veterinarian' ? 'required' : 'nullable', 'string', 'max:50'],
            'shift' => [$request->role === 'veterinarian' ? 'required' : 'nullable', 'in:morning,afternoon'],
        ]);

        // Si el rol NO es veterinario, nos aseguramos de limpiar los campos para la BD
        if ($validated['role'] !== 'veterinarian') {
            $validated['num_colegiado'] = null;
            $validated['shift'] = null;
        }

        Staff::create([
            'name' => $validated['name'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'num_colegiado' => $validated['num_colegiado'],
            'shift' => $validated['shift'],
        ]);

        return redirect('/admin/staff')->with('message', 'Staff registrado con éxito.');
    }

    public function createOwner()
    {
        return Inertia::render('admin/owners/create');
    }

    public function storeOwner(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'required|string',
            'address' => 'nullable|string|max:255',
        ]);

        $validated['password'] = Hash::make(Str::random(32));

        $client = Client::create($validated);

        $token = Password::getRepository()->create($client);

        $activationUrl = route('password.reset', [
            'token' => $token,
            'email' => $client->email
        ]);

        Mail::to($client->email)->send(new NewClientMail($client, $activationUrl));

        return redirect()->route('admin.animals.create', ['owner_id' => $client->id])
            ->with('success', 'Cliente registrado correctamente. Se ha enviado el correo de activación.');
    }

    public function create()
    {
        return Inertia::render('admin/login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('staff')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended('/admin/dashboard');
        }

        throw ValidationException::withMessages([
            'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros de personal.',
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::guard('staff')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}