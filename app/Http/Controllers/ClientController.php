<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Pet;
use App\Models\AnimalCategory;
use Inertia\Inertia;
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
            ->get()
            ->map(function ($pet) {
                return [
                    'id' => $pet->id,
                    'name' => $pet->name,
                    'chip_number' => $pet->chip_number ?? 'Sin registros',
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
            'name' => 'required|string|max:255',
            'chip_number' => 'nullable|string|max:255|unique:pets,chip_number',
            'animal_category_id' => 'required|exists:animal_categories,id',
            'weight' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
        ]);

        Pet::create([
            'client_id' => $client->id,
            'name' => $validated['name'],
            'chip_number' => $validated['chip_number'],
            'animal_category_id' => $validated['animal_category_id'],
            'weight' => $validated['weight'],
            'height' => $validated['height'],
        ]);

        return redirect()->back()->with('message', '¡Mascota registrada con éxito!');
    }
}