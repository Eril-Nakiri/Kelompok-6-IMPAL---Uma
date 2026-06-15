<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Exception;

class MatchController extends Controller
{
    public function index()
    {
        try {
            $tableName = (new GameMatch())->getTable();

            $matches = DB::table($tableName . ' as m')
                ->leftJoin('tournaments as t', 'm.id_tournament', '=', 't.id_tournament')
                ->leftJoin('teams as team_a', 'm.id_team_a', '=', 'team_a.id_team')
                ->leftJoin('teams as team_b', 'm.id_team_b', '=', 'team_b.id_team')
                ->select([
                    'm.*', 't.nama_turnamen', 't.penyelenggara',
                    'team_a.nama_tim as nama_tim_a', 'team_a.logo_url as logo_url_a', 'team_a.singkatan as singkatan_a',
                    'team_b.nama_tim as nama_tim_b', 'team_b.logo_url as logo_url_b', 'team_b.singkatan as singkatan_b',
                    DB::raw("(
                        SELECT COALESCE(json_agg(
                            json_build_object(
                                'id_match_map', mm.id_match_map, 'map_number', mm.map_number,
                                'map_name', mm.map_name, 'team_a_score', mm.team_a_score, 'team_b_score', mm.team_b_score
                            ) ORDER BY mm.map_number ASC
                        ), '[]'::json)
                        FROM match_maps mm WHERE mm.id_match = m.id_match
                    ) as maps")
                ])
                ->orderBy('m.jadwal', 'asc')
                ->get();

            $matches = collect($matches)->map(function ($match) {
                if (isset($match->maps) && is_string($match->maps)) $match->maps = json_decode($match->maps);
                return $match;
            });
            return response()->json($matches);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateSeriesScore(Request $request)
    {
        $request->validate(['id_match' => 'required|integer', 'scoreA' => 'required|integer', 'scoreB' => 'required|integer']);
        try {
            GameMatch::where('id_match', $request->id_match)->update([
                'skor_akhir_a' => $request->scoreA, 'skor_akhir_b' => $request->scoreB,
            ]);
            return response()->json(['status' => 'success', 'message' => 'Skor series diperbarui.']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function storeResult(Request $request)
    {
        $request->validate([
            'id_match' => 'required|integer', 'current_map' => 'required|string',
            'game_data.mapScoreA' => 'required|integer', 'game_data.mapScoreB' => 'required|integer',
            'game_data.mapName' => 'required|string',
        ]);

        try {
            $mapNumber = (int) filter_var($request->current_map, FILTER_SANITIZE_NUMBER_INT);

            $matchMap = DB::table('match_maps')
                ->where('id_match', $request->id_match)
                ->where('map_number', $mapNumber)
                ->first();

            if ($matchMap) {
                DB::table('match_maps')->where('id_match_map', $matchMap->id_match_map)->update([
                    'map_name' => $request->game_data['mapName'],
                    'team_a_score' => $request->game_data['mapScoreA'],
                    'team_b_score' => $request->game_data['mapScoreB']
                ]);
            } else {
                $maxMapId = DB::table('match_maps')->max('id_match_map') ?? 0;
                DB::table('match_maps')->insert([
                    'id_match_map' => $maxMapId + 1,
                    'id_match' => $request->id_match,
                    'map_number' => $mapNumber,
                    'map_name' => $request->game_data['mapName'],
                    'team_a_score' => $request->game_data['mapScoreA'],
                    'team_b_score' => $request->game_data['mapScoreB']
                ]);
            }

            $teams = ['teamA', 'teamB'];
            $agentsMap = DB::table('agents')->pluck('nama_agent', 'id_agent');

            $currentMaxStatId = DB::table('player_map_stats')->max('id_stat') ?? 0;

            foreach ($teams as $team) {
                if (isset($request->player_stats[$team])) {
                    foreach ($request->player_stats[$team] as $player) {
                        if (!empty($player['id_player'])) {
                            $idAgent = !empty($player['agent']) ? (int) $player['agent'] : null;
                            $agentUsed = $idAgent && isset($agentsMap[$idAgent]) ? $agentsMap[$idAgent] : null;

                            $statExists = DB::table('player_map_stats')
                                ->where('id_match', $request->id_match)
                                ->where('map_number', $mapNumber)
                                ->where('id_player', (int) $player['id_player'])
                                ->first();

                            $updateData = [
                                'map_name' => $request->game_data['mapName'],
                                'id_agent' => $idAgent,
                                'agent_used' => $agentUsed,
                                'kills' => $player['kills'] ?: 0,
                                'deaths' => $player['deaths'] ?: 0,
                                'assists' => $player['assists'] ?: 0,
                                'acs' => $player['acs'] ?: 0,
                                'rating' => $player['rating'] ?: 0,
                                'hs_percentage' => $player['hs'] ?: 0,
                                'first_kills' => $player['fk'] ?: 0,
                                'first_deaths' => $player['fd'] ?: 0,
                            ];

                            if ($statExists) {
                                DB::table('player_map_stats')
                                    ->where('id_stat', $statExists->id_stat)
                                    ->update($updateData);
                            } else {
                                $currentMaxStatId++;
                                DB::table('player_map_stats')->insert(array_merge([
                                    'id_stat' => $currentMaxStatId,
                                    'id_match' => $request->id_match,
                                    'map_number' => $mapNumber,
                                    'id_player' => (int) $player['id_player']
                                ], $updateData));
                            }
                        }
                    }
                }
            }
            return response()->json(['status' => 'success', 'message' => 'Hasil map & stats disimpan.']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function getMatchDetail(int $id)
    {
        try {
            $match = DB::table('matches')->where('id_match', $id)->first();
            if (!$match) {
                return response()->json(['status' => 'error', 'message' => 'Pertandingan tidak ditemukan'], 404);
            }

            $tournament = DB::table('tournaments')->where('id_tournament', $match->id_tournament)->first();
            $teamA = DB::table('teams')->where('id_team', $match->id_team_a)->first();
            $teamB = DB::table('teams')->where('id_team', $match->id_team_b)->first();

            $playersA = $teamA ? DB::table('players')->where('id_teams', $teamA->id_team)->get() : [];
            $playersB = $teamB ? DB::table('players')->where('id_teams', $teamB->id_team)->get() : [];

            $stats = DB::table('player_map_stats')->where('id_match', $id)->get();
            $maps = DB::table('match_maps')->where('id_match', $id)->get();

            $agents = DB::table('agents')->get();
            $countries = DB::table('countries')->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'match' => $match,
                    'tournament' => $tournament,
                    'team_a' => $teamA,
                    'team_b' => $teamB,
                    'players_a' => $playersA,
                    'players_b' => $playersB,
                    'stats' => $stats,
                    'maps' => $maps,
                    'agents' => $agents,
                    'countries' => $countries
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
