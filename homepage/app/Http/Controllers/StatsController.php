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
        // Menyediakan daftar seluruh Agent Valorant lengkap secara hardcoded di backend
        // agar dropdown terisi penuh dari Astra hingga agent terbaru
        $agents = [
            "Astra", "Breach", "Brimstone", "Chamber", "Clove", "Cypher",
            "Deadlock", "Fade", "Gekko", "Harbor", "Iso", "Jett", "KAY/O",
            "Killjoy", "Neon", "Omen", "Phoenix", "Raze", "Reyna", "Sage",
            "Skye", "Sova", "Tejo", "Viper", "Yoru"
        ];

        // Jika Anda juga butuh filter MAP di masa mendatang, bisa ditambahkan di sini:
        $maps = [
            "Ascent", "Bind", "Breeze", "Abyss", "Fracture",
            "Haven", "Icebox", "Lotus", "Pearl", "Split", "Sunset"
        ];

        return response()->json([
            'agents' => $agents,
            'maps' => $maps
        ]);
    }
}
