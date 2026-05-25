<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats(Request $request)
    {
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

        if ($request->filled('agent') && $request->agent !== 'All') {
            $query->where('player_map_stats.agent_used', $request->agent);
        }

        if ($request->filled('map') && $request->map !== 'All') {
            $query->where('player_map_stats.map_name', $request->map);
        }

        if ($request->filled('region') && $request->region !== 'All') {
            $query->where('players.country', $request->region);
        }

        if ($request->filled('minRating')) {
            $query->where('player_map_stats.rating', '>=', $request->minRating);
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

    public function getPlayerDetail($id) {
        $player = DB::table('players')
            ->where('id_player', $id)
            ->first();

        $stats = DB::table('player_map_stats')
            ->where('id_player', $id)
            ->get();

        return response()->json([
            'player' => $player,
            'stats' => $stats
        ]);
    }

    public function getTeamDetail($id) {
        $team = DB::table('teams')
            ->where('id_team', $id)
            ->first();

        $players = DB::table('players')
            ->where('id_teams', $id)
            ->get();

        return response()->json([
            'team' => $team,
            'players' => $players
        ]);
    }
}
