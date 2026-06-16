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
                ->join('users', 'forum_threads.id_user', '=', 'users.id_user')
                ->select('forum_threads.*', 'users.username')
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
            $id_user = $request->input('id_user');
            if (empty($id_user)) {
                $id_user = 1;
            }

            DB::table('forum_threads')->insert([
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'id_user' => (int) $id_user,
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
            $thread = DB::table('forum_threads')
                ->join('users', 'forum_threads.id_user', '=', 'users.id_user')
                ->select('forum_threads.*', 'users.username')
                ->where('id_thread', $id)
                ->first();

            $replies = DB::table('forum_replies')
                ->join('users', 'forum_replies.id_user', '=', 'users.id_user')
                ->select('forum_replies.*', 'users.username')
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

            $lastReply = DB::table('forum_replies')->max('id_reply');
            $nextReplyId = $lastReply ? $lastReply + 1 : 1;

            DB::table('forum_replies')->insert([
                'id_reply' => $nextReplyId,
                'id_thread' => (int) $threadId,
                'content' => $request->input('content'),
                'id_user' => (int) $id_user,
                'created_at' => now()
            ]);

            return response()->json(['status' => 'success', 'message' => 'Balasan berhasil dikirim!'], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }

    public function destroyThread(Request $request, int $id)
    {
        try {
            $id_user = $request->input('id_user');
            $id_role = $request->input('id_role');

            $thread = DB::table('forum_threads')->where('id_thread', $id)->first();

            if (!$thread) {
                return response()->json(['status' => 'error', 'message' => 'Diskusi tidak ditemukan'], 404);
            }

            if ($id_role != 1 && $thread->id_user != $id_user) {
                return response()->json(['status' => 'error', 'message' => 'Dilarang! Anda tidak berhak menghapus diskusi ini.'], 403);
            }

            DB::table('forum_replies')->where('id_thread', $id)->delete();

            DB::table('forum_threads')->where('id_thread', $id)->delete();

            return response()->json(['status' => 'success', 'message' => 'Diskusi beserta balasannya berhasil dihapus!'], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }

    public function destroyReply(Request $request, int $id)
    {
        try {
            $id_user = $request->input('id_user');
            $id_role = $request->input('id_role');

            $reply = DB::table('forum_replies')->where('id_reply', $id)->first();

            if (!$reply) {
                return response()->json(['status' => 'error', 'message' => 'Balasan tidak ditemukan'], 404);
            }

            if ($id_role != 1 && $reply->id_user != $id_user) {
                return response()->json(['status' => 'error', 'message' => 'Dilarang! Anda tidak berhak menghapus balasan ini.'], 403);
            }

            DB::table('forum_replies')->where('id_reply', $id)->delete();

            return response()->json(['status' => 'success', 'message' => 'Balasan berhasil dihapus!'], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }
}
