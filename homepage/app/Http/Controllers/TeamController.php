<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TeamController extends Controller
{
    public function index()
    {
        try {
            $keyword = request()->query('q', request()->query('search'));

            $query = DB::table('teams');

            if ($keyword) {
                $query->where(function ($q) use ($keyword) {
                    $q->where('nama_tim', 'ILIKE', '%' . $keyword . '%')
                    ->orWhere('singkatan', 'ILIKE', '%' . $keyword . '%');
                });
            }

            $teams = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $teams
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data tim: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $team = DB::table('teams')
                ->where('id_team', $id)
                ->first();

            if (!$team) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tim tidak ditemukan'
                ], 404);
            }

            $playersQuery = DB::table('players')
                ->where('players.id_team', $id);

            if (Schema::hasColumn('players', 'nama_negara')) {
                $players = $playersQuery
                    ->leftJoin('countries', 'players.nama_negara', '=', 'countries.nama_negara')
                    ->select(
                        'players.*',
                        'countries.flag_url'
                    )
                    ->get();
            } else {
                $players = $playersQuery
                    ->select('players.*')
                    ->get();
            }

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

    public function getPlayers($id)
    {
        try {
            $playersQuery = DB::table('players')
                ->where('players.id_team', $id);

            if (Schema::hasColumn('players', 'nama_negara')) {
                $players = $playersQuery
                    ->leftJoin('countries', 'players.nama_negara', '=', 'countries.nama_negara')
                    ->select(
                        'players.*',
                        'countries.flag_url'
                    )
                    ->get();
            } else {
                $players = $playersQuery
                    ->select('players.*')
                    ->get();
            }

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
