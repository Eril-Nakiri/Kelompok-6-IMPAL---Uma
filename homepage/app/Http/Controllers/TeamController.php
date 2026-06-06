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
}
