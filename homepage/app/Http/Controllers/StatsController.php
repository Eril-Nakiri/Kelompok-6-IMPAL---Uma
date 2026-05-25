<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats(Request $request)
    {
        // 1. Ambil data dari player_match_stats dan gabungkan (JOIN) dengan tabel players
        $query = DB::table('player_match_stats')
            ->join('players', 'player_match_stats.id_player', '=', 'players.id_player')
            ->select(
                'player_match_stats.*',
                'players.nama as nama', // Mengambil kolom 'nama' dari tabel players untuk dibaca oleh React
                DB::raw("'FA' as nama_tim"), // Placeholder tim (kamu bisa join tabel teams nanti jika diperlukan)
                DB::raw('13 as rounds')      // Nilai dummy rounds agar kolom RND di React tidak tampil 0
            );

        // 2. FILTER AGENT (Diselaraskan dengan kolom 'agent_used')
        if ($request->filled('agent') && $request->agent !== 'All') {
            $query->where('player_match_stats.agent_used', $request->agent);
        }

        // 3. FILTER MAP (Diselaraskan dengan kolom 'map_name')
        if ($request->filled('map') && $request->map !== 'All') {
            $query->where('player_match_stats.map_name', $request->map);
        }

        // 4. FILTER MIN RATING (Diselaraskan dengan kolom 'rating')
        if ($request->filled('minRating')) {
            $query->where('player_match_stats.rating', '>=', $request->minRating);
        }

        // 5. FILTER MIN ROUNDS (Buka komentar ini jika nanti kamu sudah menambahkan kolom round di database)
        /*
        if ($request->filled('minRounds')) {
            $query->where('player_match_stats.rounds_played', '>=', $request->minRounds);
        }
        */

        // Ambil data maksimal 50 baris teratas demi kecepatan loading website
        $data = $query->limit(50)->get();

        // Mengembalikan data terbungkus dalam properti 'data' agar langsung terbaca oleh React
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function getFilters()
    {
        $agents = [
            "Astra", "Breach", "Brimstone", "Chamber", "Clove", "Cypher",
            "Deadlock", "Fade", "Gekko", "Harbor", "Iso", "Jett", "KAY/O",
            "Killjoy", "Neon", "Omen", "Phoenix", "Raze", "Reyna", "Sage",
            "Skye", "Sova", "Tejo", "Viper", "Yoru"
        ];

        $maps = [
            "Abyss", "Ascent", "Bind", "Breeze", "District", "Fracture",
            "Haven", "Icebox", "Lotus", "Pearl", "Split", "Sunset"
        ];

        return response()->json([
            'agents' => $agents,
            'maps' => $maps
        ]);
    }
}
