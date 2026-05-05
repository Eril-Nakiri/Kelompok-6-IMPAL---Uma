<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2'
        ]);

        $query = $request->query('query');

        $users = UserAccount::where('username', 'ILIKE', "%{$query}%")
            ->orWhere('email', 'ILIKE', "%{$query}%")
            ->limit(5)
            ->get(['id_user', 'username', 'email']);

        return response()->json($users);
    }
}
