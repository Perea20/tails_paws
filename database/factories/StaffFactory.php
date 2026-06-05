<?php

namespace Database\Factories;

use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class StaffFactory extends Factory
{
    protected $model = Staff::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'lastname' => $this->faker->lastName() . ' ' . $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'), 
            'role' => 'veterinarian',
            'num_colegiado' => $this->faker->unique()->numerify('########'),
            'shift' => 'morning',     
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function morning(): static
    {
        return $this->state(fn (array $attributes) => [
            'shift' => 'morning',
        ]);
    }

    public function afternoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'shift' => 'afternoon',
        ]);
    }
}