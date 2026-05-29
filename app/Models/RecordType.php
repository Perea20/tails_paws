<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RecordType extends Model
{

    protected $table = 'record_types';

    protected $fillable = ['name'];


    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'record_type_id');
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class, 'record_type_id');
    }
}