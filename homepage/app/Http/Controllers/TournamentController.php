<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TournamentController extends Controller
{
    public function index()
    {
        try {
            $tournaments = \App\Models\Tournament::all();

            return response()->json($tournaments, 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data database: ' . $e->getMessage()
            ], 500);
        }
    }
    public function store(Request $request)
    {
        $request->validate([
            'nama_turnamen' => 'required|string',
            'penyelenggara' => 'required|string',
        ]);

        try {
            $tournament = Tournament::create([
                'nama_turnamen' => $request->nama_turnamen,
                'penyelenggara' => $request->penyelenggara,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Turnamen baru berhasil disimpan!',
                'data' => $tournament
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal input database: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getMatches()
    {
        try {
            $matches = DB::table('matches')
                            ->orderBy('id', 'desc')
                            ->limit(5)
                            ->get();

            return response()->json($matches, 200);

        } catch (\Exception $e) {
            return response()->json([], 200);
        }
    }
    public function getStats()
    {
        try {
            $totalTournaments = DB::table('tournaments')->count();
            $activeMatches    = DB::table('matches')->where('status', 'ongoing')->count();
            $totalTeams       = DB::table('teams')->count();
            $totalUsers       = DB::table('users')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'totalTournaments' => $totalTournaments,
                    'activeMatches'    => $activeMatches,
                    'totalTeams'       => $totalTeams,
                    'totalUsers'       => $totalUsers
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'data' => [
                    'totalTournaments' => 0,
                    'activeMatches'    => 0,
                    'totalTeams'       => 0,
                    'totalUsers'       => 0
                ]
            ], 200);
        }
    }
}
