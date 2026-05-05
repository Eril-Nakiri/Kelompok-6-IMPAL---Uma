<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAccount;

class UserController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->query('query');

        // TANPA VALIDASI DULU BIAR DEBUG MUDAH
        if (!$query) {
            return response()->json([
                'data' => []
            ]);
        }

        $users = UserAccount::where('username', 'ILIKE', "%{$query}%")
            ->orWhere('email', 'ILIKE', "%{$query}%")
            ->limit(5)
            ->get(['id_user', 'username', 'email']);

        return response()->json([
            'data' => $users
        ]);
    }
}
