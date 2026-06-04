<?php

namespace Database\Factories;

use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StaffFactory extends Factory
{
    protected $model = Staff::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName() . ' ' . $this->faker->lastName(), // Dos apellidos
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'), 
            'num_colegiado' => $this->faker->unique()->numerify('########'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}