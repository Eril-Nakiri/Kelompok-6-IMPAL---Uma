<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats(Request $request)
    {
        $query = DB::table('player_match_stats');

        // FILTER AGENT
        if ($request->agent && $request->agent !== 'All') {
            $query->where('agent_used', $request->agent);
        }

        // FILTER MIN KILLS (opsional)
        if ($request->minKills) {
            $query->where('kills', '>=', $request->minKills);
        }

        $data = $query->limit(50)->get();

        return response()->json([
            'data' => $data
        ]);
    }

    public function getFilters()
    {
        $agents = DB::table('player_match_stats')
            ->select('agent_used')
            ->distinct()
            ->orderBy('agent_used')
            ->pluck('agent_used');

        return response()->json([
            'agents' => $agents
        ]);
    }
}
