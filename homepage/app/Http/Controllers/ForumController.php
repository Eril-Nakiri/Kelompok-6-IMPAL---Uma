<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class ForumController extends Controller
{
    public function getThreads()
    {
        try {
            $threads = DB::table('forum_threads')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(['status' => 'success', 'data' => $threads], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function storeThread(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'id_user' => 'required'
        ]);

        try {
            DB::table('forum_threads')->insert([
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'id_user' => (int) $request->input('id_user'),
                'created_at' => now()
            ]);

            return response()->json(['status' => 'success', 'message' => 'Thread berhasil dibuat!'], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }

    public function getThreadDetail(int $id)
    {
        try {
            $thread = DB::table('forum_threads')->where('id_thread', $id)->first();

            if (!$thread) {
                return response()->json(['status' => 'error', 'message' => 'Thread tidak ditemukan'], 404);
            }

            $replies = DB::table('forum_replies')
                ->where('id_thread', $id)
                ->orderBy('created_at', 'asc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'thread' => $thread,
                    'replies' => $replies
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function storeReply(Request $request, int $id)
    {
        $threadId = $id ?? $request->route('id');

        $request->validate([
            'content' => 'required|string',
            'id_user' => 'required'
        ]);

        try {
            $id_user = $request->input('id_user');
            if (empty($id_user)) {
                $id_user = 1;
            }

            DB::table('forum_replies')->insert([
                'id_thread' => (int) $threadId,
                'title' => $request->input('title', 'Re: Thread ' . $threadId),
                'content' => $request->input('content'),
                'id_user' => (int) $id_user,
                'created_at' => now()
            ]);

            return response()->json(['status' => 'success', 'message' => 'Balasan berhasil dikirim!'], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }
}
