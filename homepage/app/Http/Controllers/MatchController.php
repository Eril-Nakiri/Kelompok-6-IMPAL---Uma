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
                    'm.*',
                    't.nama_turnamen',
                    't.penyelenggara',
                    'team_a.nama_tim as nama_tim_a',
                    'team_a.logo_url as logo_url_a',
                    'team_a.singkatan as singkatan_a',
                    'team_b.nama_tim as nama_tim_b',
                    'team_b.logo_url as logo_url_b',
                    'team_b.singkatan as singkatan_b',

                    DB::raw("(
                        SELECT COALESCE(json_agg(
                            json_build_object(
                                'id_match_map', mm.id_match_map,
                                'map_number', mm.map_number,
                                'map_name', mm.map_name,
                                'team_a_score', mm.team_a_score,
                                'team_b_score', mm.team_b_score
                            ) ORDER BY mm.map_number ASC
                        ), '[]'::json)
                        FROM match_maps mm
                        WHERE mm.id_match = m.id_match
                    ) as maps")
                ])
                ->get();

            $matches = collect($matches)->map(function ($match) {
                if (isset($match->maps) && is_string($match->maps)) {
                    $match->maps = json_decode($match->maps);
                }
                return $match;
            });

            return response()->json($matches);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_tournament' => 'required|integer',
            'id_team_a' => 'required|integer',
            'id_team_b' => 'required|integer|different:id_team_a',
            'match_format' => 'required|string',
            'jadwal' => 'required|date',
            'skor_akhir_a' => 'required|integer',
            'skor_akhir_b' => 'required|integer'
        ]);

        try {
            $match = GameMatch::create([
                'id_tournament' => $request->id_tournament,
                'id_team_a' => $request->id_team_a,
                'id_team_b' => $request->id_team_b,
                'match_format' => $request->match_format,
                'jadwal' => $request->jadwal,
                'skor_akhir_a' => $request->skor_akhir_a,
                'skor_akhir_b' => $request->skor_akhir_b,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal berhasil dibuat!',
                'data' => $match
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal input database: ' . $e->getMessage()
            ], 500);
        }
    }

    public function storeResult(Request $request)
    {
        $request->validate([
            'id_match' => 'required|integer',
            'current_map' => 'required|string',
            'game_data.matchScoreA' => 'required|integer',
            'game_data.matchScoreB' => 'required|integer',
            'game_data.scoreA' => 'required|integer',
            'game_data.scoreB' => 'required|integer',
            'game_data.mapName' => 'required|string',
        ]);

        try {
            $mapNumber = (int) filter_var($request->current_map, FILTER_SANITIZE_NUMBER_INT);

            GameMatch::where('id_match', $request->id_match)->update([
                'skor_akhir_a' => $request->game_data['matchScoreA'],
                'skor_akhir_b' => $request->game_data['matchScoreB'],
            ]);

            DB::table('match_maps')->updateOrInsert(
                [
                    'id_match' => $request->id_match,
                    'map_number' => $mapNumber
                ],
                [
                    'map_name' => $request->game_data['mapName'],
                    'team_a_score' => $request->game_data['scoreA'],
                    'team_b_score' => $request->game_data['scoreB'],
                ]
            );

            $teams = ['teamA', 'teamB'];
            $agentsMap = DB::table('agents')->pluck('nama_agent', 'id_agent');

            foreach ($teams as $team) {
                if (isset($request->player_stats[$team])) {
                    foreach ($request->player_stats[$team] as $player) {
                        if (!empty($player['id_player'])) {

                            $idAgent = !empty($player['agent']) ? (int) $player['agent'] : null;
                            $agentUsed = $idAgent && isset($agentsMap[$idAgent]) ? $agentsMap[$idAgent] : null;

                            DB::table('player_map_stats')->updateOrInsert(
                                [
                                    'id_match' => $request->id_match,
                                    'map_number' => $mapNumber,
                                    'id_player' => (int) $player['id_player'],
                                ],
                                [
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
                                ]
                            );
                        }
                    }
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Hasil pertandingan map dan statistik pemain berhasil disimpan.'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan hasil: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}
