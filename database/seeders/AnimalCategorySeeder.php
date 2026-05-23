<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AnimalCategory;

class AnimalCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Perro'],
            ['name' => 'Gato'],
            ['name' => 'Ave'],
            ['name' => 'Roedor'],
            ['name' => 'Reptil'],
            ['name' => 'Exótico'],
        ];

        foreach ($categories as $category) {
            AnimalCategory::create($category);
        }
    }
}