<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // PENTING: Untuk akses tabel tanpa model

class TournamentController extends Controller
{
    // 1. Handler untuk '＋ Buat Turnamen' (POST /api/tournament)
    public function store(Request $request)
    {
        $request->validate([
            'nama_turnamen' => 'required|string|max:255',
            'penyelenggara' => 'required|string|max:255',
        ]);

        try {
            $tournament = Tournament::create([
                'nama_turnamen' => $request->nama_turnamen,
                'penyelenggara' => $request->penyelenggara,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Turnamen berhasil dibuat!',
                'data' => $tournament
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan ke database: ' . $e->getMessage()
            ], 500);
        }
    }

    // 2. Handler untuk 'Recent Matches' (GET /api/matches)
    public function getMatches()
    {
        try {
            // PENTING: Ganti 'matches' dengan nama tabel asli pertandingan Anda di database pgsql
            $matches = DB::table('matches')
                            ->orderBy('id', 'desc')
                            ->limit(5)
                            ->get();

            return response()->json($matches, 200);

        } catch (\Exception $e) {
            // Jika tabel belum ada atau error, kirim array kosong agar React tidak crash
            return response()->json([], 200);
        }
    }

    // 3. Handler untuk 'Stats Card Grid' (GET /api/dashboard-stats)
    public function getStats()
    {
        try {
            // Hitung total data langsung dari masing-masing tabel asli Anda
            // PENTING: Ganti nama tabel di dalam DB::table('...') sesuai nama tabel asli pgsql Anda
            $totalTournaments = DB::table('tournament')->count();
            $activeMatches    = DB::table('matches')->where('status', 'ongoing')->count(); // Sesuaikan kondisi kolom status Anda
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
            // Jika ada tabel yang belum siap, kirim data default angka 0 agar tampilan React tetap rapi
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
