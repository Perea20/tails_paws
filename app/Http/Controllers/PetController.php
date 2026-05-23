<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PetController extends Controller
{
    public function index()
    {
        $pets = Pet::with(['client', 'category'])->orderBy('name', 'asc')->paginate(10);

        $pets->setCollection($pets->getCollection()->map(function ($pet) {
            return [
                'id' => $pet->id,
                'name' => $pet->name,
                'chip_number' => $pet->chip_number ?? 'Sin Chip',
                'weight' => $pet->weight ?? 'N/R',
                'height' => $pet->height ?? 'N/R',
                'category' => $pet->category ? $pet->category->name : 'No definida', 
                'owner' => $pet->client ? [
                    'name' => $pet->client->name . ' ' . $pet->client->lastname,
                    'phone' => $pet->client->phone,
                    'email' => $pet->client->email,
                ] : null
            ];
        }));

        return Inertia::render('admin/animals', [
            'animals' => $pets
        ]);
    }
}