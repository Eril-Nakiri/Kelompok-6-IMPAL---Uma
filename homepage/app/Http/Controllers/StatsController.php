<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats(Request $request)
    {
        // Hubungkan ke tabel di PostgreSQL (Pastikan nama tabel ini benar-benar sesuai di database-mu)
        $query = DB::table('player_match_stats');

        // 1. FILTER AGENT
        if ($request->filled('agent') && $request->agent !== 'All') {
            $query->where('agent_used', $request->agent);
        }

        // 2. FILTER MAP (Diaktifkan)
        if ($request->filled('map') && $request->map !== 'All') {
            // Menggunakan nama kolom 'map_name', sesuaikan jika kolom di PostgreSQL-mu bernama 'map'
            $query->where('map_name', $request->map);
        }

        // 3. FILTER REGION (Diaktifkan jika kolomnya tersedia)
        if ($request->filled('region') && $request->region !== 'All') {
            $query->where('region', $request->region);
        }

        // 4. FILTER EVENT SERIES (Diaktifkan jika kolomnya tersedia)
        if ($request->filled('eventSeries') && $request->eventSeries !== 'All') {
            $query->where('event_series', $request->eventSeries);
        }

        // 5. FILTER MIN ROUNDS (Diaktifkan)
        if ($request->filled('minRounds')) {
            // Disesuaikan menjadi 'rounds' mengikuti properti row.rounds di React kamu
            $query->where('rounds', '>=', $request->minRounds);
        }

        // 6. FILTER MIN RATING (Diaktifkan)
        if ($request->filled('minRating')) {
            $query->where('rating', '>=', $request->minRating);
        }

        // Ambil data maksimal 50 baris teratas untuk optimasi performa
        $data = $query->limit(50)->get();

        // Mengembalikan bungkus objek data langsung agar dibaca oleh setStats(data.data || data) di React
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function getFilters()
    {
        // Menyediakan daftar nama Agent lengkap untuk sinkronisasi dropdown frontend
        $agents = [
            "Astra", "Breach", "Brimstone", "Chamber", "Clove", "Cypher",
            "Deadlock", "Fade", "Gekko", "Harbor", "Iso", "Jett", "KAY/O",
            "Killjoy", "Neon", "Omen", "Phoenix", "Raze", "Reyna", "Sage",
            "Skye", "Sova", "Tejo", "Viper", "Yoru"
        ];

        // Menyediakan daftar Map lengkap untuk sinkronisasi dropdown frontend
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
