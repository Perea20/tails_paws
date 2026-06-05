<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Attachment;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    public function edit($appointment_id)
    {
        $record = MedicalRecord::where('appointment_id', $appointment_id)->with('attachments')->first();
        $appointment = Appointment::findOrFail($appointment_id);

        return Inertia::render('admin/medical-records/create', [
            'record' => $record,
            'isEdit' => !!$record,
            'appointment_id' => $appointment_id,
            'appointment_data' => [
                'pet_id' => $appointment->pet_id,
                'pet_name' => $appointment->pet->name,
                'staff_id' => $appointment->staff_id,
                'staff_name' => $appointment->staff->name,
                'record_type_id' => $appointment->record_type_id,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required',
            'staff_id' => 'required',
            'record_type_id' => 'required',
            'appointment_id' => 'required|unique:medical_records,appointment_id',
            'diagnosis' => 'required|string',
            'status' => 'required|in:abierta,cerrada',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:256000',
        ]);

        $record = MedicalRecord::create($validated);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('medical-records', 'public');
            Attachment::create([
                'medical_record_id' => $record->id,
                'file_path' => $path,
                'file_name' => $request->file('file')->getClientOriginalName(),
            ]);
        }
        
        return redirect('/admin/dashboard')->with('success', 'Informe registrado con éxito.');
    }

    public function update(Request $request, $id)
    {
        $medicalRecord = MedicalRecord::findOrFail($id);

        $validated = $request->validate([
            'diagnosis' => 'required|string',
            'status' => 'required|in:abierta,cerrada',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:256000', 
        ]);

        $medicalRecord->update([
            'diagnosis' => $validated['diagnosis'],
            'status' => $validated['status'],
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('medical-records', 'public');
            Attachment::create([
                'medical_record_id' => $medicalRecord->id,
                'file_path' => $path,
                'file_name' => $request->file('file')->getClientOriginalName(),
            ]);
        }
        
        return redirect()->route('dashboard')->with('success', 'Informe actualizado correctamente.');
    }

    public function destroyAttachment($id)
    {
        $attachment = Attachment::findOrFail($id);
        
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }
        
        $attachment->delete();
        
        return redirect()->back()->with('success', 'Archivo eliminado.');
    }
}