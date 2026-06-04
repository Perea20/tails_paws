<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon; 

class PetController extends Controller
{
    public function index()
    {
        $pets = Pet::with(['client', 'category'])->orderBy('name', 'asc')->paginate(10);

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
}