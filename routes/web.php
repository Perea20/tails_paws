<?php

use App\Http\Controllers\ClientController;
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


// --- PARTE PRIVADA (INTRANET / ADMIN) ---

Route::prefix('admin')->middleware(['auth'])->group(function () {
    
    Route::get('/admin/dashboard', function () {
    return Inertia::render('admin/dashboard'); 
})->middleware(['auth'])->name('dashboard');

});
