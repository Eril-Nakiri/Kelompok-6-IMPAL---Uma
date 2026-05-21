<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats(Request $request)
    {
        $query = DB::table('player_match_stats');

        // 1. FILTER AGENT (Hanya memfilter jika user memilih agent spesifik, bukan 'All')
        if ($request->filled('agent') && $request->agent !== 'All') {
            $query->where('agent_used', $request->agent);
        }

        // 2. FILTER MAP (Abaikan jika 'All' atau kosong)
        if ($request->filled('map') && $request->map !== 'All') {
            // Jika di table database Anda ada kolom map, aktifkan baris bawah ini:
            // $query->where('map_name', $request->map);
        }

        // 3. FILTER REGION (Abaikan jika 'All' atau kosong)
        if ($request->filled('region') && $request->region !== 'All') {
            // $query->where('region', $request->region);
        }

        // 4. FILTER EVENT SERIES (Abaikan jika 'All' atau kosong)
        if ($request->filled('eventSeries') && $request->eventSeries !== 'All') {
            // $query->where('event_series', $request->eventSeries);
        }

        // 5. FILTER MIN ROUNDS (Hanya filter jika ada angka inputan dari user)
        if ($request->filled('minRounds')) {
            // $query->where('rounds_played', '>=', $request->minRounds);
        }

        // 6. FILTER MIN RATING / MIN OOP RATING
        if ($request->filled('minRating')) {
            // $query->where('rating', '>=', $request->minRating);
        }

        // Ambil data maksimal 50 baris teratas
        $data = $query->limit(50)->get();

        return response()->json([
            'data' => $data
        ]);
    }

    public function getFilters()
    {
        // Menyediakan daftar nama Agent lengkap
        $agents = [
            "Astra", "Breach", "Brimstone", "Chamber", "Clove", "Cypher",
            "Deadlock", "Fade", "Gekko", "Harbor", "Iso", "Jett", "KAY/O",
            "Killjoy", "Neon", "Omen", "Phoenix", "Raze", "Reyna", "Sage",
            "Skye", "Sova", "Tejo", "Viper", "Yoru"
        ];

        // Menyediakan daftar Map lengkap
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
