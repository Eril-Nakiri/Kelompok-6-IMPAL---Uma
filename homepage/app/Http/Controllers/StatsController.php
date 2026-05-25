<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats(Request $request)
    {
        // 1. DIUBAH MENJADI leftJoin AGAR DATA STATISTIK TETAP KELUAR MESKIPUN PROFIL PLAYER BELUM LENGKAP 🔥
        $query = DB::table('player_map_stats')
            ->leftJoin('players', 'player_map_stats.id_player', '=', 'players.id_player')
            ->select(
                'player_map_stats.*',
                'players.nama as nama',
                'players.country as country',
                'players.photo_url as photo_url',
                DB::raw("'FA' as nama_tim"),
                DB::raw('13 as rounds')
            );

        // 2. Filter Agent
        if ($request->filled('agent') && $request->agent !== 'All') {
            $query->where('player_map_stats.agent_used', $request->agent);
        }

        // 3. Filter Map
        if ($request->filled('map') && $request->map !== 'All') {
            $query->where('player_map_stats.map_name', $request->map);
        }

        // 4. Filter Region / Country (Hanya memfilter jika memilih negara tertentu)
        if ($request->filled('region') && $request->region !== 'All') {
            $query->where('players.country', $request->region);
        }

        // 5. Filter Min Rating
        if ($request->filled('minRating')) {
            $query->where('player_map_stats.rating', '>=', $request->minRating);
        }

        // Ambil data maksimal 50 baris teratas demi kecepatan loading
        $data = $query->limit(50)->get();

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

        $countries = DB::table('players')
            ->whereNotNull('country')
            ->distinct()
            ->orderBy('country', 'asc')
            ->pluck('country');

        $tournaments = DB::table('tournaments')
            ->whereNotNull('nama_turnamen')
            ->distinct()
            ->orderBy('nama_turnamen', 'asc')
            ->pluck('nama_turnamen');

        return response()->json([
            'agents' => $agents,
            'maps' => $maps,
            'countries' => $countries,
            'tournaments' => $tournaments
        ]);
    }

    public function globalSearch(Request $request)
    {
        $keyword = $request->input('q');

        if (!$keyword) {
            return response()->json([]);
        }

        // 1. Cari data Player
        $players = DB::table('players')
            ->where('nama', 'ILIKE', '%' . $keyword . '%')
            ->select(
                'id_player as id',
                'nama as name',
                'photo_url as image',
                DB::raw("'player' as type")
            )
            ->limit(5)
            ->get();

        // 2. Cari data Tim
        $teams = DB::table('teams')
            ->where('nama_tim', 'ILIKE', '%' . $keyword . '%')
            ->select(
                'id_team as id',
                'nama_tim as name',
                'logo_url as image',
                DB::raw("'team' as type")
            )
            ->limit(5)
            ->get();

        $results = $players->merge($teams);

        return response()->json($results);
    }
}
