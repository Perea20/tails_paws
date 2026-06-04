<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $adminData = config('staff.admin_credentials');
        $receptionData = config('staff.reception_credentials');

        if (!$adminData['email'] || !$adminData['password']) {
            $this->command->error('Error: Credenciales de Administrador incompletas en el .env');
            return;
        }

        if (!$receptionData['email'] || !$receptionData['password']) {
            $this->command->error('Error: Credenciales de Recepción incompletas en el .env');
            return;
        }

        Staff::updateOrCreate(
            ['email' => $adminData['email']], 
            [
                'name'          => $adminData['name'],
                'lastname'      => $adminData['lastname'],
                'password'      => Hash::make($adminData['password']),
                'num_colegiado' => $adminData['num_colegiado'],
            ]
        );

        Staff::updateOrCreate(
            ['email' => $receptionData['email']], 
            [
                'name'          => $receptionData['name'],
                'lastname'      => $receptionData['lastname'],
                'password'      => Hash::make($receptionData['password']),
                'num_colegiado' => $receptionData['num_colegiado'],
            ]
        );

        // Tus 10 usuarios aleatorios de prueba
        Staff::factory()->count(10)->create();
    }
}