<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Pet;
use App\Models\AnimalCategory;
use App\Models\Appointment;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Http\RedirectResponse;

class ClientController extends Controller
{
    public function store(Request $request): RedirectResponse
    {

        $request->validate([
            'name'     => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:clients',
            'phone'    => 'nullable|string|max:20',
            'address'  => 'nullable|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $client = Client::create([
            'name'     => $request->name,
            'lastname' => $request->lastname,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'address'  => $request->address,
            'password' => Hash::make($request->password),
        ]);

        Auth::login($client);
        return redirect('/');
    }

    public function profile()
    {
        $client = Auth::user(); 

        $myPets = Pet::where('client_id', $client->id)
            ->with('category')
            ->paginate(6)
            ->through(function ($pet) {
                return [
                    'id' => $pet->id,
                    'name' => $pet->name,
                    'chip_number' => $pet->chip_number ?? 'Sin registros',
                    'gender' => $pet->gender ?? '—',
                    'birth_date' => $pet->birth_date ? Carbon::parse($pet->birth_date)->format('d/m/Y') : '—',
                    'weight' => $pet->weight ? $pet->weight . ' kg' : 'N/R',
                    'height' => $pet->height ? $pet->height . ' cm' : 'N/R',
                    'category' =>$pet->category->name,
                ];
            });

        $categories = AnimalCategory::all(['id', 'name']);

        return Inertia::render('auth/profile', [
            'client' => $client,
            'myPets' => $myPets,
            'categories' => $categories
        ]);
    }

    public function storePet(Request $request)
    {
        $client = Auth::user();

        $validated = $request->validate([

            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pets')->where(function ($query) use ($client) {
                    return $query->where('client_id', $client->id);
                }),
            ],
          
            'chip_number' => 'nullable|string|max:255|unique:pets,chip_number',
            'animal_category_id' => 'required|exists:animal_categories,id',
            'weight' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'gender' => 'nullable|string|in:Macho,Hembra',
            'birth_date' => 'nullable|date', 
        ], [
            'name.unique' => 'Ya tienes una mascota registrada con este nombre.',
            'chip_number.unique' => 'Este número de chip ya está registrado por otro usuario.',
        ]);


        Pet::create([
            'client_id' => $client->id,
            'name' => $validated['name'],
            'chip_number' => $validated['chip_number'],
            'animal_category_id' => $validated['animal_category_id'],
            'weight' => $validated['weight'],
            'height' => $validated['height'],
            'gender' => $request->gender ?: null,
            'birth_date' => $request->birth_date ?: null,
        ]);

        return redirect()->back()->with('message', '¡Mascota registrada con éxito!');
    }

    public function myAppointments() 
    {
        $client = Auth::user();
        
        $today = Carbon::today()->toDateString();

        $appointments = Appointment::whereHas('pet', function ($query) {
                $query->where('client_id', auth()->id());
            })
            ->with(['pet', 'recordType', 'staff'])
            ->where('date', '>=', $today)
            ->orderBy('date', 'asc')       
            ->orderBy('time', 'asc')
            ->get();
            
        $pastAppointments = Appointment::whereHas('pet', function ($query) {
                $query->where('client_id', auth()->id());
            })
            ->with(['pet', 'recordType', 'staff'])
            ->where('date', '<', $today)
            ->orderBy('date', 'desc')      
            ->orderBy('time', 'desc')
            ->get();

        return Inertia::render('auth/my-appointments', [
            'client'           => $client,
            'appointments'     => $appointments,
            'pastAppointments' => $pastAppointments,
        ]);
    }
}