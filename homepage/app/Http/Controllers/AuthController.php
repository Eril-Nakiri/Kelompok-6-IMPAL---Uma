<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAccount;

class AuthController extends Controller {
    public function login(Request $request) {
        $user = UserAccount::where(
            'username',
            $request->username
        )->where(
            'password',
            $request->password
        )->first();

        if($user){
            return response()->json([
                "success"=>true,
                "user"=>$user
            ]);
        }

        return response()->json([
            "success"=>false,
            "message"=>"Username/password salah"
        ],401);
    }
}
