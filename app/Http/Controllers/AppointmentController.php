<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\RecordType;
use App\Models\Pet;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AppointmentController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('auth/appointment', [
            'recordTypes' => RecordType::select('id', 'name')->get(),
            'pets' => Pet::where('client_id', $request->user()->id)->select('id', 'name')->get()
        ]);
    }

    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'pet_id' => 'nullable|exists:pets,id'
        ]);

        if ($request->filled('pet_id')) {
            $hasDuplicate = Appointment::where('client_id', $request->user()->id)
                ->where('pet_id', $request->pet_id)
                ->where('date', $request->date)
                ->exists();

            if ($hasDuplicate) {
                return response()->json([
                    'slots' => [],
                    'hasDuplicate' => true
                ]);
            }
        }

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek;

        if ($dayOfWeek === 0) {
            return response()->json(['slots' => [], 'hasDuplicate' => false]);
        }

        $slots = [];

        if ($dayOfWeek >= 1 && $dayOfWeek <= 5) {
            $slots = array_merge(
                $this->generateTimeSlots($request->date . ' 09:00', $request->date . ' 13:30'),
                $this->generateTimeSlots($request->date . ' 16:00', $request->date . ' 20:30')
            );
        } else if ($dayOfWeek === 6) {
            $slots = $this->generateTimeSlots($request->date . ' 09:00', $request->date . ' 15:30');
        }

        $vetsMorningCount = Staff::where('role', 'veterinarian')->where('shift', 'morning')->count();
        $vetsAfternoonCount = Staff::where('role', 'veterinarian')->where('shift', 'afternoon')->count();

        $occupiedSlotsGrouped = Appointment::where('date', $request->date)
            ->get()
            ->groupBy(function($appointment) {
                return Carbon::parse($appointment->time)->format('H:i');
            });

        $availableSlots = [];

        foreach ($slots as $slot) {
            $hour = (int) explode(':', $slot)[0];
            
            if ($dayOfWeek === 6) {
                $maxCapacity = $vetsMorningCount; 
            } else {
                $maxCapacity = ($hour < 15) ? $vetsMorningCount : $vetsAfternoonCount;
            }

            if ($maxCapacity <= 0) {
                continue;
            }

            $appointmentsCount = isset($occupiedSlotsGrouped[$slot]) ? $occupiedSlotsGrouped[$slot]->count() : 0;

            if ($appointmentsCount < $maxCapacity) {
                $availableSlots[] = $slot;
            }
        }

        return response()->json([
            'slots' => $availableSlots,
            'hasDuplicate' => false
        ]);
    }

    public function store(Request $request)
    {
        $clientId = $request->user()->id;

        $validated = $request->validate([
            'pet_id' => [
                'required',
                'exists:pets,id',
                function ($attribute, $value, $fail) use ($request, $clientId) {
                    $exists = Appointment::where('client_id', $clientId)
                        ->where('pet_id', $value)
                        ->where('date', $request->date)
                        ->exists();

                    if ($exists) {
                        $fail('Esta mascota ya tiene una cita reservada para este día.');
                    }
                },
            ],
            'record_type_id' => 'required|exists:record_types,id',
            'date' => 'required|date',
            'time' => 'required',
        ]);

        $date = Carbon::parse($validated['date']);
        $dayOfWeek = $date->dayOfWeek;
        $hour = (int) explode(':', $validated['time'])[0];

        if ($dayOfWeek === 6) {
            $shift = 'morning';
        } else {
            $shift = ($hour < 15) ? 'morning' : 'afternoon';
        }

        $availableStaff = Staff::where('role', 'veterinarian')
            ->where('shift', $shift)
            ->whereDoesntHave('appointments', function ($query) use ($validated) {
                $query->where('date', $validated['date'])
                    ->where('time', $validated['time']);
            })
            ->get();

        if ($availableStaff->isEmpty()) {
            return redirect()->back()->withErrors(['time' => 'No hay veterinarios disponibles para el turno solicitado en este horario.']);
        }

        $randomStaff = $availableStaff->random();

        $appointment = new Appointment();
        $appointment->client_id = $clientId;
        $appointment->pet_id = $validated['pet_id'];
        $appointment->record_type_id = $validated['record_type_id'];
        $appointment->date = $validated['date'];
        $appointment->time = $validated['time'];
        $appointment->staff_id = $randomStaff->id;
        $appointment->save();

        return redirect('/my-appointments')->with('success', '¡Cita reservada con éxito!');
    }

    private function generateTimeSlots($start, $end): array
    {
        $slots = [];
        $period = CarbonPeriod::since($start)->minutes(30)->until($end);
        foreach ($period as $date) {
            $slots[] = $date->format('H:i');
        }
        return $slots;
    }

    public function showMedicalRecord($id)
    {
        $appointment = Appointment::with(['medicalRecord.attachments', 'staff', 'recordType'])
            ->findOrFail($id);

        return Inertia::render('auth/medical-record', [
            'appointment' => $appointment
        ]);
    }
}