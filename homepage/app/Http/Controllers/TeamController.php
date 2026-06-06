<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TeamController extends Controller
{
    public function index()
    {
        try {
            $keyword = request()->query('q', request()->query('search'));

            $teams = Team::query()
                ->when($keyword, function ($query) use ($keyword) {
                    $query->where(function ($subQuery) use ($keyword) {
                        $subQuery->where('nama_tim', 'ILIKE', '%' . $keyword . '%')
                            ->orWhere('singkatan', 'ILIKE', '%' . $keyword . '%');
                    });
                })
                ->get();

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

    public function show(int $id)
    {
        try {
            $teamPrimaryKey = Schema::hasColumn('teams', 'id_teams') ? 'id_teams' : 'id';

            $team = DB::table('teams')
                ->where($teamPrimaryKey, $id)
                ->first();

            if (!$team) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tim tidak ditemukan'
                ], 404);
            }

            $players = $this->getPlayersWithFlag($id);

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

    public function getPlayers(int $id)
    {
        try {
            $players = $this->getPlayersWithFlag($id);

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

    private function getPlayersWithFlag(int $teamId)
    {
        $playerCountryColumn = null;

        if (Schema::hasColumn('players', 'nama_negara')) {
            $playerCountryColumn = 'nama_negara';
        } elseif (Schema::hasColumn('players', 'negara')) {
            $playerCountryColumn = 'negara';
        } elseif (Schema::hasColumn('players', 'country')) {
            $playerCountryColumn = 'country';
        }

        $playersQuery = DB::table('players')
            ->where('players.id_teams', $teamId);

        if ($playerCountryColumn) {
            return $playersQuery
                ->leftJoin('countries', 'players.' . $playerCountryColumn, '=', 'countries.nama_negara')
                ->select(
                    'players.*',
                    DB::raw('players.' . $playerCountryColumn . ' as nama_negara'),
                    'countries.flag_url as flag_url'
                )
                ->get();
        }

        return $playersQuery
            ->select('players.*')
            ->get();
    }
}
