<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\AgentController;

// tes API
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


// Login
Route::post('/login', [AuthController::class, 'login']);

// Register
Route::post('/register', [AuthController::class, 'register']);

// Forgot Password
Route::post('/forgot-password-verify', [AuthController::class, 'verifyForgotAccount']);
Route::post('/forgot-password-update', [AuthController::class, 'updateForgotPassword']);

// User Search //fitur gak kepake
Route::get('/users/search', [UserController::class, 'search']);
Route::get('/players/{id}', [StatsController::class, 'getPlayerDetail']);
Route::get('/teams/{id}', [StatsController::class, 'getTeamDetail']);
Route::get('/search', [StatsController::class, 'globalSearch']);

// Stats
Route::get('/stats', [StatsController::class, 'getStats']);
Route::get('/stats/filters', [StatsController::class, 'getFilters']);

// matches
Route::get('/matches', [MatchController::class, 'index']);
Route::post('/match', [MatchController::class, 'store']);
Route::post('/match-result', [MatchController::class, 'storeResult']);

// Admin Tournament
Route::post('/tournament', [TournamentController::class, 'store']);
Route::get('/tournament', [TournamentController::class, 'index']);
Route::delete('/tournament/{id}', [App\Http\Controllers\TournamentController::class, 'destroy']);

// Admin Team
Route::get('/teams', [TeamController::class, 'index']);
Route::get('/teams/{id}/players', [TeamController::class, 'getPlayers']);

// Daftar Agent
Route::get('/agents', [AgentController::class, 'index']);
