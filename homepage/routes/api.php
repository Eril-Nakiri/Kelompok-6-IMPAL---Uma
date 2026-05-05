<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatsController;


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
Route::post('/login',[AuthController::class,'login']);

/* REGISTER */
Route::post('/register', [AuthController::class, 'register']);

/* USER SEARCH */
Route::get('/users/search', [UserController::class, 'search']);

/* STATS */
Route::get('/stats', [StatsController::class, 'getStats']);
Route::get('/stats/filters', [StatsController::class, 'getFilters']);
