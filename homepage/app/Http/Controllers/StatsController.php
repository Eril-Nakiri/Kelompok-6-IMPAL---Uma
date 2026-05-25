<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats(Request $request)
    {
        // 1. Mulai query dari tabel utama 'player_match_stats'
        // Lakukan JOIN ke tabel akun user untuk mengambil nama asli pemain dan nama tim.
        // PENTING: Ganti 'user_accounts' dengan nama tabel user/pemain yang asli di database-mu jika berbeda.
        $query = DB::table('player_match_stats')
            ->join('user_accounts', 'player_match_stats.id_player', '=', 'user_accounts.id_user')
            ->select(
                'player_match_stats.*',
                'user_accounts.username as nama', // Meng-alias username menjadi 'nama' agar terbaca di React
                DB::raw("'FA' as nama_tim"),     // Placeholder jika kamu belum memiliki tabel tim, atau join tabel timmu di sini
                DB::raw('15 as rounds')          // Dummy atau ganti dengan kolom jumlah round jika ada di tabel match
            );

        // 2. FILTER AGENT
        if ($request->filled('agent') && $request->agent !== 'All') {
            $query->where('player_match_stats.agent_used', $request->agent);
        }

        // 3. FILTER MAP (Diselaraskan dengan kolom database-mu: 'map_name')
        if ($request->filled('map') && $request->map !== 'All') {
            $query->where('player_match_stats.map_name', $request->map);
        }

        // 4. FILTER MIN ROUNDS (Menggunakan raw query atau kolom pengganti sejenis)
        if ($request->filled('minRounds')) {
            // Karena di tabelmu tidak ada kolom rounds, sementara kita kunci atau sesuaikan ke kolom stat lain
            // $query->where('player_match_stats.kolom_round_kamu', '>=', $request->minRounds);
        }

        // 5. FILTER MIN RATING (Diselaraskan dengan kolom database-mu: 'rating')
        if ($request->filled('minRating')) {
            $query->where('player_match_stats.rating', '>=', $request->minRating);
        }

        // Ambil data maksimal 50 baris teratas demi optimasi kecepatan PostgreSQL
        $data = $query->limit(50)->get();

        // Mengembalikan data terbungkus dalam properti 'data' sesuai permintaan fetchStatsData di React
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
