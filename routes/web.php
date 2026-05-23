<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\PetController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- PARTE PÚBLICA (CLIENTES) ---
Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/register', function () {
    return Inertia::render('auth/register');
});

Route::post('/register', [ClientController::class, 'store']);


// --- PARTE PRIVADA (DUEÑOS) ---
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ClientController::class, 'profile'])->name('client.profile');
    Route::post('/profile/pet', [ClientController::class, 'storePet'])->name('client.pet.store');
});

// --- ACCESO STAFF (LOGIN / LOGOUT) ---
Route::get('/admin/login', [StaffController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [StaffController::class, 'store']);
Route::post('/admin/logout', [StaffController::class, 'destroy'])->name('admin.logout');


// --- PARTE PRIVADA (STAFF) ---
Route::prefix('admin')->middleware(['auth:staff'])->group(function () {
    
    Route::get('/dashboard', [StaffController::class, 'dashboard'])->name('dashboard');
    Route::get('/animals', [PetController::class, 'index'])->name('admin.animals.index');
    Route::get('/staff/create', [StaffController::class, 'createStaff'])->name('admin.staff.create');
    Route::post('/staff', [StaffController::class, 'storeStaff'])->name('admin.staff.store');
    
});