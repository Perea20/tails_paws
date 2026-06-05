<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Staff extends Authenticatable
{
    use Notifiable, HasFactory;

    protected $table = 'staff';

    protected $fillable = [
        'name',
        'lastname',
        'email',
        'role',
        'password',
        'num_colegiado',
        'shift'
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'staff_id');
    }

    /**
     * Los atributos que deben ocultarse en arrays.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Los atributos que deben ser casteados.
     */
    protected $casts = [
        'password' => 'hashed',
    ];
}