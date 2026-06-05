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
                'role'          => 'admin',
                'num_colegiado' => null,
                'shift'         => null, 
            ]
        );

        Staff::updateOrCreate(
            ['email' => $receptionData['email']], 
            [
                'name'          => $receptionData['name'],
                'lastname'      => $receptionData['lastname'],
                'password'      => Hash::make($receptionData['password']),
                'role'          => 'reception',
                'num_colegiado' => null, 
                'shift'         => null, 
            ]
        );

        Staff::factory()->count(5)->morning()->create();
        Staff::factory()->count(5)->afternoon()->create();
    }
}