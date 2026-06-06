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
            ->where(function ($query) use ($keyword) {
                $query->where('nama_tim', 'ILIKE', '%' . $keyword . '%')
                    ->orWhere('singkatan', 'ILIKE', '%' . $keyword . '%');
            })
            ->select(
                'id_team as id',
                'nama_tim as name',
                'logo_url as image',
                'singkatan',
                DB::raw("'team' as type")
            )
            ->limit(5)
            ->get();

        $results = $players->merge($teams);

        return response()->json($results);
    }

    public function getPlayerDetail(int $id)
    {
        try {
            $player = DB::table('players')
                ->leftJoin('countries', 'players.country', '=', 'countries.nama_negara')
                ->leftJoin('teams', 'players.id_teams', '=', 'teams.id_team')
                ->where('players.id_player', $id)
                ->select(
                    'players.id_player',
                    'players.id_teams',
                    'players.nama',
                    'players.country',
                    'players.role',
                    'players.photo_url',
                    'countries.flag_url as flag_url',
                    'teams.logo_url as team_logo'
                )
                ->first();

            if (!$player) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Player tidak ditemukan'
                ], 404);
            }

            $rawStats = DB::table('player_map_stats')
                ->leftJoin('agents', function ($join) {
                    $join->on('player_map_stats.id_agent', '=', 'agents.id_agent')
                        ->orOn('player_map_stats.agent_used', '=', 'agents.nama_agent');
                })
                ->where('player_map_stats.id_player', $id)
                ->select(
                    'player_map_stats.*',
                    'agents.nama_agent as agent_name',
                    'agents.icon_url as icon_url'
                )
                ->get();

            $totalMaps = max($rawStats->count(), 1);

            $stats = $rawStats
                ->groupBy(function ($row) {
                    return $row->id_agent ?: ($row->agent_used ?: 'unknown');
                })
                ->map(function ($rows) use ($totalMaps) {
                    $first = $rows->first();
                    $mapsUsed = $rows->count();

                    $kills = (int) $rows->sum('kills');
                    $deaths = (int) $rows->sum('deaths');
                    $assists = (int) $rows->sum('assists');
                    $firstKills = (int) $rows->sum('first_kills');
                    $firstDeaths = (int) $rows->sum('first_deaths');

                    return [
                        'name' => $first->agent_name ?: $first->agent_used,
                        'img' => $first->icon_url,

                        'use' => '(' . $mapsUsed . ') ' . round(($mapsUsed / $totalMaps) * 100) . '%',

                        'rtg' => round((float) $rows->avg('rating'), 2),
                        'acs' => round((float) $rows->avg('acs'), 1),

                        'kd' => $deaths > 0 ? round($kills / $deaths, 2) : $kills,

                        'hs' => round((float) $rows->avg('hs_percentage'), 1) . '%',

                        'k' => $kills,
                        'd' => $deaths,
                        'a' => $assists,
                        'fk' => $firstKills,
                        'fd' => $firstDeaths,
                    ];
                })
                ->values();

            return response()->json([
                'status' => 'success',
                'player' => $player,
                'stats' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil detail player: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTeamDetail(int $id)
    {
        try {
            $team = DB::table('teams')
                ->select('id_team', 'nama_tim', 'logo_url', 'singkatan')
                ->where('id_team', $id)
                ->first();

            if (!$team) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Team tidak ditemukan'
                ], 404);
            }

            $players = DB::table('players')
                ->leftJoin('countries', 'players.country', '=', 'countries.nama_negara')
                ->where('players.id_teams', $id)
                ->select(
                    'players.*',
                    'countries.flag_url as flag_url'
                )
                ->get();

            return response()->json([
                'status' => 'success',
                'team' => $team,
                'players' => $players
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil detail team: ' . $e->getMessage()
            ], 500);
        }
    }
}
