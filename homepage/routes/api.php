<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\TournamentController;


// TEST API
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


// LOGIN
Route::post('/login', [AuthController::class, 'login']);

// REGISTER
Route::post('/register', [AuthController::class, 'register']);

// FORGOT PASSWORD VERIFICATION
Route::post('/forgot-password-verify', [AuthController::class, 'verifyForgotAccount']);
Route::post('/forgot-password-update', [AuthController::class, 'updateForgotPassword']);

// USER SEARCH
Route::get('/users/search', [UserController::class, 'search']);
Route::get('/players/{id}', [StatsController::class, 'getPlayerDetail']);
Route::get('/teams/{id}', [StatsController::class, 'getTeamDetail']);
Route::get('/search', [StatsController::class, 'globalSearch']);

// STATS
Route::get('/stats', [StatsController::class, 'getStats']);
Route::get('/stats/filters', [StatsController::class, 'getFilters']);

// MATCHES
Route::get('/matches', [MatchController::class, 'index']);

// TOURNAMENTS ADMIN
Route::post('/tournament', [TournamentController::class, 'store']);
