<?php

use Illuminate\Support\Facades\Route;

Route::get('/api/status', function () {
    return response()->json([
        'app' => 'META Portal Esports',
        'version' => '1.0.0',
        'status' => 'Connected to Laravel via API Path'
    ]);
});

Route::get('/{any}', function () {
    return view('home');
})->where('any', '.*');
