<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Client;
use App\Models\AnimalCategory;

class Pet extends Model
{
    use HasFactory;

    protected $table = 'pets';

    protected $fillable = [
        'chip_number',
        'client_id',
        'animal_category_id',
        'name',
        'weight',
        'height',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
    public function category(): BelongsTo
    {
        return $this->belongsTo(AnimalCategory::class, 'animal_category_id');
    }
}