<?php

use Illuminate\Support\Facades\Route;

// 1. Tempatkan rute khusus API/JSON di PALING ATAS
Route::get('/', function () {
    // Jika ada request dari frontend/React, kembalikan data JSON ini
    return response()->json([
        'app' => 'META Portal Esports',
        'version' => '1.0.0',
        'status' => 'Connected to Laravel'
    ]);
});

// 2. Rute catch-all untuk halaman web/HTML letakkan di PALING BAWAH
Route::get('/{any}', function () {
    return view('home');
})->where('any', '.*');
