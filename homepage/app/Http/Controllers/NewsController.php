<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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

    public function getNewsDetail(int $id)
    {
        try {
            $news = DB::table('news')->where('id_news', $id)->first();

            if (!$news) {
                return response()->json(['status' => 'error', 'message' => 'Berita tidak ditemukan'], 404);
            }

            return response()->json(['status' => 'success', 'data' => $news], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function index()
    {
        try {
            $news = DB::table('news')->orderBy('tanggal', 'desc')->get();
            return response()->json(['status' => 'success', 'data' => $news], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $featured = filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN);

            DB::table('news')->insert([
                'judul' => $request->input('judul'),
                'isi_berita' => $request->input('isi_berita'),
                'publisher' => $request->input('publisher', 'Admin'),
                'tanggal' => $request->input('tanggal') ?? now(),
                'featured' => $featured,
                'thumbnail_url' => $request->input('thumbnail_url', '')
            ]);

            return response()->json(['status' => 'success', 'message' => 'Berita berhasil ditambahkan!'], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            DB::table('news')->where('id_news', $id)->delete();
            return response()->json(['status' => 'success', 'message' => 'Berita berhasil dihapus!'], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
