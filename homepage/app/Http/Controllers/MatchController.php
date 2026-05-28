<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;

class MatchController extends Controller
{
    public function index()
    {
        $matches = GameMatch::all();
        return response()->json($matches);
    }
}
