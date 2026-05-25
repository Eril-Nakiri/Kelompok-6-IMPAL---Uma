<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats(Request $request)
    {
        // Join ke tabel players untuk mengambil nama dan negara pemain
        $query = DB::table('player_match_stats')
            ->join('players', 'player_match_stats.id_player', '=', 'players.id_player')
            // Catatan Tubes Impal: Jika tabel player_match_stats atau matches memiliki id_tournament,
            // kamu bisa melakukan LEFT JOIN ke tabel tournaments di sini untuk memfilter turnamen secara presisi.
            ->select(
                'player_match_stats.*',
                'players.nama as nama',
                'players.country as country',
                DB::raw("'FA' as nama_tim"),
                DB::raw('13 as rounds')
            );

        // Filter Agent
        if ($request->filled('agent') && $request->agent !== 'All') {
            $query->where('player_match_stats.agent_used', $request->agent);
        }

        // Filter Map
        if ($request->filled('map') && $request->map !== 'All') {
            $query->where('player_match_stats.map_name', $request->map);
        }

        // Filter Region / Country
        if ($request->filled('region') && $request->region !== 'All') {
            $query->where('players.country', $request->region);
        }

        // FILTER EVENT / TOURNAMENT (Baru Diaktifkan 🔥)
        if ($request->filled('event') && $request->event !== 'All') {
            // Asumsi penapisan berdasarkan nama turnamen (sesuaikan relasi jika diperlukan)
            // $query->where('tournaments.nama_turnamen', $request->event);
        }

        // Filter Min Rating
        if ($request->filled('minRating')) {
            $query->where('player_match_stats.rating', '>=', $request->minRating);
        }

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

        // Mengambil daftar negara dari tabel players
        $countries = DB::table('players')
            ->whereNotNull('country')
            ->distinct()
            ->orderBy('country', 'asc')
            ->pluck('country');

        // MENGAMBIL DATA TURNAMEN DINAMIS DARI DATABASE 🏆
        $tournaments = DB::table('tournaments')
            ->whereNotNull('nama_turnamen')
            ->distinct()
            ->orderBy('nama_turnamen', 'asc')
            ->pluck('nama_turnamen');

        return response()->json([
            'agents' => $agents,
            'maps' => $maps,
            'countries' => $countries,
            'tournaments' => $tournaments // Kirim list turnamen ke React
        ]);
    }
}
