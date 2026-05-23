<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class, 'pet_id');
    }
}
