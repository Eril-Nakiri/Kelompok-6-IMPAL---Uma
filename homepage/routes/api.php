<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\NewsController;

// tes API
Route::get('/ping', function () {
    return response()->json(['message' => 'Laravel API hidup 🔥']);
});

Route::get('/dashboard', function () {
    return response()->json([
        "app" => "META Portal", "status" => "Connected to Laravel", "user" => "Felix (soon 😎)", "version" => "1.0"
    ]);
});

// Login & Register
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Forgot Password
Route::post('/forgot-password-verify', [AuthController::class, 'verifyForgotAccount']);
Route::post('/forgot-password-update', [AuthController::class, 'updateForgotPassword']);

// Search & Stats
Route::get('/users/search', [UserController::class, 'search']);
Route::get('/players/{id}', [StatsController::class, 'getPlayerDetail']);
Route::get('/search', [StatsController::class, 'globalSearch']);
Route::get('/stats', [StatsController::class, 'getStats']);
Route::get('/stats/filters', [StatsController::class, 'getFilters']);

// Matches
Route::get('/matches', [MatchController::class, 'index']);
Route::post('/match', [MatchController::class, 'store']);
Route::post('/match-result', [MatchController::class, 'storeResult']); // Untuk simpan skor map & statistik
Route::post('/matches/update-series', [MatchController::class, 'updateSeriesScore']); // Untuk simpan skor series (2-0, 2-1)

// Admin Tournament
Route::post('/tournament', [TournamentController::class, 'store']);
Route::get('/tournament', [TournamentController::class, 'index']);
Route::delete('/tournament/{id}', [App\Http\Controllers\TournamentController::class, 'destroy']);

// Admin Team & Agent
Route::get('/teams', [TeamController::class, 'index']);
Route::get('/teams/{id}/players', [TeamController::class, 'getPlayers']);
Route::get('/agents', [AgentController::class, 'index']);

// Forum Routes
Route::get('/forum/threads', [ForumController::class, 'getThreads']);
Route::post('/forum/threads', [ForumController::class, 'storeThread']);
Route::get('/forum/threads/{id}', [ForumController::class, 'getThreadDetail']);
Route::post('/forum/threads/{id}/replies', [ForumController::class, 'storeReply']);

// News
Route::get('/news', [NewsController::class, 'getDashboardNews']);

//Teams Detail
Route::get('/teams', [TeamController::class, 'index']);
Route::get('/teams/{id}/players', [TeamController::class, 'getPlayers']);
Route::get('/teams/{id}', [TeamController::class, 'getTeamDetail']);
