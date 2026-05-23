<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use App\Models\Appointment; 
use App\Models\Staff; 
class StaffController extends Controller
{

    public function dashboard()
    {
        $user = Auth::guard('staff')->user();

        if (!$user) {
            return redirect()->route('admin.login');
        }

        if ($user->email === 'admin@admin.com') {
            $appointments = Appointment::with('pet')
                ->orderBy('date', 'asc')
                ->get();
        } else {

            $appointments = Appointment::with('pet')
                ->where('staff_id', $user->id) 
                ->orderBy('date', 'asc')
                ->get();
        }

        return Inertia::render('admin/dashboard', [
            'appointments' => $appointments
        ]);
    }
    public function createStaff()
    {

        if (Auth::guard('staff')->user()->email !== 'admin@admin.com') {
            abort(403, 'No tienes permisos para registrar nuevo personal.');
        }

        return Inertia::render('admin/CreateStaff');
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
            'password' => ['required', 'string', 'min:8'],
            'num_colegiado' => ['required', 'string', 'max:50'],
        ]);

        Staff::create([
            'name' => $validated['name'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'num_colegiado' => $validated['num_colegiado'],
        ]);

        return redirect()->back()->with('message', 'Personal registrado con éxito.');
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