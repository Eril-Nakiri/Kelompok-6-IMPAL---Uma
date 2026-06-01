<?php

namespace App\Http\Controllers;

use App\Models\Team;

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
}
