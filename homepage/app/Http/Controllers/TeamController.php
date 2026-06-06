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
                'data' => $players
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data pemain: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $team = DB::table('teams')
                ->where('id', $id)
                ->first();

            if (!$team) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tim tidak ditemukan'
                ], 404);
            }

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
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil detail tim: ' . $e->getMessage()
            ], 500);
        }
    }
}
