<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\AppointmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\NewPasswordController;
use App\Http\Controllers\MedicalRecordController;
use Illuminate\Support\Facades\Mail; 
use App\Mail\ContactMessageMail;   

// --- PARTE PÚBLICA (CLIENTES) ---
Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/register', function () {
    return Inertia::render('auth/register');
});

Route::post('/register', [ClientController::class, 'store']);

Route::post('/contact', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'message' => 'required|string',
    ]);

    Mail::to('tailspawsclinic@gmail.com')->send(new ContactMessageMail($validated));

    return back()->with('status', '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
});

// --- RESET DE CONTRASEÑAS ---
Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');

// --- PARTE PRIVADA (DUEÑOS) ---
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ClientController::class, 'profile'])->name('client.profile');
    Route::get('/my-appointments', [ClientController::class, 'myAppointments'])->name('client.appointments');
    Route::post('/profile/pet', [ClientController::class, 'storePet'])->name('client.pet.store');
    Route::get('/appointments/create', [AppointmentController::class, 'create'])->name('appointments.create');
    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    Route::get('/appointments/available-slots', [AppointmentController::class, 'getAvailableSlots']);
    Route::get('/profile/pets/{pet}/history', [PetController::class, 'showHistory'])->name('pets.history');
    Route::get('/appointments/{appointment}/medical-record', [AppointmentController::class, 'showMedicalRecord'])->name('appointments.medical-record');
});

// --- ACCESO STAFF (LOGIN / LOGOUT) ---
Route::get('/admin/login', [StaffController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [StaffController::class, 'store']);
Route::post('/admin/logout', [StaffController::class, 'destroy'])->name('admin.logout');

// --- PARTE PRIVADA (STAFF) ---
Route::prefix('admin')->middleware(['auth:staff'])->group(function () {
    
    Route::get('/dashboard', [StaffController::class, 'dashboard'])->name('dashboard');
    Route::get('/animals', [PetController::class, 'index'])->name('admin.animals.index');
    Route::get('/animals/create', [PetController::class, 'create'])->name('admin.animals.create'); 
    Route::post('/animals', [PetController::class, 'store'])->name('admin.animals.store');       
    Route::get('/animals/{pet}/edit', [PetController::class, 'edit'])->name('admin.animals.edit');
    Route::put('/animals/{pet}', [PetController::class, 'update'])->name('admin.animals.update');
    Route::get('/staff/create', [StaffController::class, 'createStaff'])->name('admin.staff.create');
    Route::post('/staff', [StaffController::class, 'storeStaff'])->name('admin.staff.store');
    Route::get('/staff', [StaffController::class, 'index'])->name('admin.staff.index');
    Route::get('/owners/create', [StaffController::class, 'createOwner'])->name('admin.owners.create');
    Route::post('/owners', [StaffController::class, 'storeOwner'])->name('admin.owners.store');  
    Route::get('/medical-records/{appointment_id}/edit', [MedicalRecordController::class, 'edit'])->name('admin.medical-records.edit');
    Route::post('/medical-records', [MedicalRecordController::class, 'store'])->name('admin.medical-records.store');
    Route::put('/medical-records/{id}', [MedicalRecordController::class, 'update'])->name('admin.medical-records.update');
    Route::delete('/attachments/{attachment}', [MedicalRecordController::class, 'destroyAttachment'])->name('admin.attachments.destroy');
});