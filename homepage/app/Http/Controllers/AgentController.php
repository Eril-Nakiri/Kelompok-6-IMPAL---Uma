<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class AgentController extends Controller
{
    public function index()
    {
        try {
            $agents = DB::table('agents')->orderBy('nama_agent', 'asc')->get();

            return response()->json([
                'status' => 'success',
                'data' => $agents
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data agents: ' . $e->getMessage()
            ], 500);
        }
    }
}
