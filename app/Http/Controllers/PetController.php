<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\Client;
use App\Models\AnimalCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon; 

class PetController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Pet::with(['client', 'category']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('chip_number', 'like', "%{$search}%")
                  ->orWhereHas('client', function ($clientQuery) use ($search) {
                      $clientQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('lastname', 'like', "%{$search}%");
                  })
                  ->orWhereHas('category', function ($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $pets = $query->orderBy('name', 'asc')
                      ->paginate(6) 
                      ->withQueryString(); 

        $pets->setCollection($pets->getCollection()->map(function ($pet) {
            
            $ageText = 'N/R';
            if ($pet->birth_date) {
                $birth = Carbon::parse($pet->birth_date);
                $now = Carbon::now();

                $years = (int) $birth->diffInYears($now);
                $months = (int) $birth->diffInMonths($now);

                if ($years > 0) {
                    $ageText = $years == 1 ? '1 año' : $years . ' años';
                } elseif ($months > 0) {
                    $ageText = $months == 1 ? '1 mes' : $months . ' meses';
                } else {
                    $ageText = 'Cachorro (semanas)';
                }
            }

            return [
                'id' => $pet->id,
                'name' => $pet->name,
                'chip_number' => $pet->chip_number ?? 'Sin Chip',
                'weight' => $pet->weight ?? 'N/R',
                'height' => $pet->height ?? 'N/R',
                'gender' => $pet->gender ?? 'N/R',
                'age' => $ageText, 
                'category' => $pet->category ? $pet->category->name : 'No definida', 
                'owner' => $pet->client ? [
                    'name' => $pet->client->name . ' ' . $pet->client->lastname,
                    'phone' => $pet->client->phone,
                    'email' => $pet->client->email,
                ] : null
            ];
        }));

        return Inertia::render('admin/animals/animals', [
            'animals' => $pets
        ]);
    }

    public function create(Request $request)
    {
        $ownerId = $request->query('owner_id');
        $owner = Client::find($ownerId);

        if (class_exists(AnimalCategory::class)) {
            $categories = AnimalCategory::select('id', 'name')->get();
        } else {
            $categories = DB::table('animal_categories')->select('id', 'name')->get();
        }

        return Inertia::render('admin/animals/create', [
            'owner_id' => $ownerId,
            'owner' => $owner,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pets')->where(function ($query) use ($request) {
                    return $query->where('animal_category_id', $request->animal_category_id)
                                 ->where('client_id', $request->client_id);
                }),
            ],
            'chip_number' => 'nullable|string|max:255|unique:pets,chip_number',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'animal_category_id' => 'required|exists:animal_categories,id',
            'client_id' => 'required|exists:clients,id',
        ], [
            'name.unique' => 'Este cliente ya tiene registrado un animal con el mismo nombre y especie.',
        ]);

        Pet::create($validated);

        return redirect('/admin/animals')->with('message', 'Mascota registrada con éxito.');
    }
}