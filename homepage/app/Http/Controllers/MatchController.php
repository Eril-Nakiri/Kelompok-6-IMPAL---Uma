<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB; // WAJIB ADA: Untuk menjalankan query manual & JOIN

class MatchController extends Controller
{
    public function index()
    {
        $matches = DB::table('matches as m')
            // JOIN ke tabel tournament tunggal
            ->leftJoin('tournament as t', 'm.id_tournament', '=', 't.id_tournament')
            // JOIN ke tabel teams untuk mendapatkan detail Team A
            ->leftJoin('teams as team_a', 'm.id_team_a', '=', 'team_a.id_team')
            // JOIN ke tabel teams untuk mendapatkan detail Team B
            ->leftJoin('teams as team_b', 'm.id_team_b', '=', 'team_b.id_team')
            ->select([
                'm.id_match',
                'm.match_format',
                'm.skor_akhir_a',
                'm.skor_akhir_b',
                'm.jadwal',
                'm.id_tournament',
                't.nama_turnamen',
                't.penyelenggara',
                'm.id_team_a',
                'team_a.nama_tim as nama_tim_a',
                'team_a.logo_url as logo_url_a',
                'team_a.singkatan as singkatan_a',
                'm.id_team_b',
                'team_b.nama_tim as nama_tim_b',
                'team_b.logo_url as logo_url_b',
                'team_b.singkatan as singkatan_b',

                // Subquery khusus PostgreSQL untuk menarik array JSON dari match_maps
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
    }
}
