<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Exception;

class NewsController extends Controller
{
    public function getDashboardNews()
    {
        try {
            $featuredNews = DB::table('news')
                ->where('featured', true)
                ->orderBy('tanggal', 'desc')
                ->first();

            $regularNews = DB::table('news')
                ->orderBy('tanggal', 'desc')
                ->limit(6)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'featured' => $featuredNews,
                    'regular' => $regularNews
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil berita: ' . $e->getMessage()
            ], 500);
        }
    }
}
