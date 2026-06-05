<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Attachment;

class MedicalRecord extends Model
{
    protected $table = 'medical_records';

    protected $fillable = [
        'pet_id',
        'staff_id',
        'record_type_id',
        'appointment_id',
        'diagnosis',
        'status',
        'file_path',
    ];

    public function recordType(): BelongsTo
    {
        return $this->belongsTo(RecordType::class, 'record_type_id');
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class, 'pet_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }
    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'medical_record_id');
    }
}