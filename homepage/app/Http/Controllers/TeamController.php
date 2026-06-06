<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Support\Facades\DB;

class TeamController extends Controller
{
    public function index()
    {
        try {
            $teams = Team::all();

            return response()->json([
                'status' => 'success',
                'data' => $teams
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data tim dari database: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPlayers(int $id)
    {
        try {
            $players = DB::table('players')->where('id_teams', $id)->get();

            return response()->json([
                'status' => 'success',
                'data' => $players
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data pemain: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTeamDetail(int $id)
    {
        $team = DB::table('teams')
            ->select('id_team', 'nama_tim', 'logo_url', 'singkatan')
            ->where('id_team', $id)
            ->first();

        $players = DB::table('players')
            ->leftJoin('countries', 'players.nama_negara', '=', 'countries.nama_negara')
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
        ]);
    }
}
