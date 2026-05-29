<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AppointmentController extends Controller
{

    public function create(Request $request)
    {
        return Inertia::render('auth/appointment', [
            'recordTypes' => \App\Models\RecordType::select('id', 'name')->get(),
            'pets' => \App\Models\Pet::where('client_id', $request->user()->id)->select('id', 'name')->get()
        ]);
    }

    public function getAvailableSlots(Request $request)
    {
        $request->validate(['date' => 'required|date|after_or_equal:today']);
        
        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek; // 0 = Domingo, 1 = Lunes, etc.

        if ($dayOfWeek === 0) {
            return response()->json([]); // Domingo cerrado
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

        $occupiedSlots = Appointment::where('date', $request->date)
            ->pluck('time')
            ->map(fn($time) => Carbon::parse($time)->format('H:i'))
            ->toArray();

        $availableSlots = array_values(array_diff($slots, $occupiedSlots));

        return response()->json($availableSlots);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'record_type_id' => 'required|exists:record_types,id',
            'date' => 'required|date',
            'time' => 'required',
        ]);

        $availableStaff = \App\Models\Staff::where('id', '!=', 1)
            ->whereDoesntHave('appointments', function ($query) use ($validated) {
                $query->where('date', $validated['date'])
                    ->where('time', $validated['time']);
            })
            ->get();

        $randomStaff = $availableStaff->random();

        $appointment = new Appointment();
        $appointment->client_id = $request->user()->id;
        $appointment->pet_id = $validated['pet_id'];
        $appointment->record_type_id = $validated['record_type_id'];
        $appointment->date = $validated['date'];
        $appointment->time = $validated['time'];
        $appointment->staff_id = $randomStaff->id;
        $appointment->save();

        return redirect()->route('home')->with('success', '¡Cita reservada con éxito!');
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
}