<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use Illuminate\Support\Facades\DB;
use Exception;

class MatchController extends Controller
{
    public function index()
    {
        try {
            $tableName = (new GameMatch())->getTable();

            $matches = DB::table($tableName . ' as m')
                // JOIN ke tabel tournament tunggal
                ->leftJoin('tournaments as t', 'm.id_tournament', '=', 't.id_tournament')
                // JOIN ke tabel teams untuk mendapatkan detail Team A
                ->leftJoin('teams as team_a', 'm.id_team_a', '=', 'team_a.id_team')
                // JOIN ke tabel teams untuk mendapatkan detail Team B
                ->leftJoin('teams as team_b', 'm.id_team_b', '=', 'team_b.id_team')
                ->select([
                    'm.*', // Mengambil semua kolom bawaan dari tabel match utama
                    't.nama_turnamen',
                    't.penyelenggara',
                    'team_a.nama_tim as nama_tim_a',
                    'team_a.logo_url as logo_url_a',
                    'team_a.singkatan as singkatan_a',
                    'team_b.nama_tim as nama_tim_b',
                    'team_b.logo_url as logo_url_b',
                    'team_b.singkatan as singkatan_b',

                    // Subquery PostgreSQL untuk menarik data maps
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

            // Mengubah teks string JSON dari PostgreSQL menjadi Array objek
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
}
