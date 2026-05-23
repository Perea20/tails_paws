<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnimalCategory extends Model
{
    use HasFactory;

    protected $table = 'animal_categories';
    protected $fillable = ['name'];

    public function pets()
    {
        return $this->hasMany(Pet::class, 'animal_category_id');
    }
}