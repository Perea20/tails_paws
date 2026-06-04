<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use App\Models\Appointment; 
use App\Models\Staff; 
use App\Models\Pet; 
use Carbon\Carbon;

class StaffController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/staff/staff', [
            'staff' => Staff::paginate(10),
        ]);
    }

    public function dashboard()
    {
        $user = Auth::guard('staff')->user();

        if (!$user) {
            return redirect()->route('admin.login');
        }

        // 1. Obtenemos las citas con sus relaciones correspondientes
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

        // 2. Clasificación utilizando métodos semánticos de Carbon
        foreach ($appointments as $app) {
            // Creamos un objeto Carbon combinando la fecha y hora de la base de datos
            $appointmentDateTime = Carbon::parse($app->date . ' ' . $app->time);

            // isPast() determina con precisión si la fecha y hora de la cita ya han pasado respecto al instante actual
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

    public function storeStaff(Request $request)
    {
        if (Auth::guard('staff')->user()->email !== 'admin@admin.com') {
            abort(403, 'No tienes permisos para realizar esta acción.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:staff'], 
            'password' => ['required', 'string'],
            'num_colegiado' => ['required', 'string', 'max:50'],
        ]);

        Staff::create([
            'name' => $validated['name'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'num_colegiado' => $validated['num_colegiado'],
        ]);

        return redirect('/admin/staff')->with('message', 'Staff registrado con éxito.');
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