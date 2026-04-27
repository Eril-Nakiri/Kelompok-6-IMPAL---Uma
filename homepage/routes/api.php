<?php

use Illuminate\Support\Facades\Route;

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
