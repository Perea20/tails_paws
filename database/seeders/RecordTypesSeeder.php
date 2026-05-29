<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RecordType;

class RecordTypesSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Revisión'],
            ['name' => 'Desparasitación'],
            ['name' => 'Chequeo preventivo'],
            ['name' => 'Vacunación'],
            ['name' => 'Especialista'],
            ['name' => 'Diagnosis'],
        ];

        foreach ($types as $type) {
            RecordType::create($type);
        }
    }
}