<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


/* TEST API */
Route::get('/ping', function () {
    return response()->json([
        'message' => 'Laravel API hidup 🔥'
    ]);
});


Route::get('/dashboard', function () {
    return response()->json([
        "app" => "META Portal",
        "status" => "Connected to Laravel",
        "user" => "Felix (soon 😎)",
        "version" => "1.0"
    ]);
});


/* LOGIN */
Route::post('/login',
    [AuthController::class,'login']
);
