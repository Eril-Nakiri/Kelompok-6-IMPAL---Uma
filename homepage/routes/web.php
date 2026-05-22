<?php

use Illuminate\Support\Facades\Route;

// Buat rute dengan prefix /api/ agar aman dari tabrakan rute web
Route::get('/api/status', function () {
    return response()->json([
        'app' => 'META Portal Esports',
        'version' => '1.0.0',
        'status' => 'Connected to Laravel via API Path'
    ]);
});

// Kembalikan rute catch-all Anda seperti semula
Route::get('/{any}', function () {
    return view('home');
})->where('any', '.*');
