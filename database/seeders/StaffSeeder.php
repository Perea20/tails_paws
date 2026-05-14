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

        if (!$adminData['email'] || !$adminData['password']) {
            $this->command->error('Error: Credenciales incompletas en el .env');
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
    }
}