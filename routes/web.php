<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\StaffController; // Importamos el controlador de staff
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

// --- ACCESO STAFF (LOGIN) ---
Route::get('/admin/login', [StaffController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [StaffController::class, 'store']);
Route::post('/admin/logout', [StaffController::class, 'destroy'])->name('admin.logout');


// --- PARTE PRIVADA (STAFF) ---
Route::prefix('admin')->middleware(['auth:staff'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard'); 
    })->name('dashboard');

});