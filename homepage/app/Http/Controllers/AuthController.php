<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAccount;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = UserAccount::where('username', $request->username)
            ->where('password', $request->password)
            ->first();

        if ($user) {
            return response()->json([
                "success" => true,
                "user" => $user
            ]);
        }

        return response()->json([
            "success" => false,
            "message" => "Username/password salah"
        ], 401);
    }

    public function register(Request $request)
    {
        // validasi sederhana (biar tidak asal masuk)
        if(!$request->username || !$request->password){
            return response()->json([
                "success"=>false,
                "message"=>"Username & password wajib"
            ],400);
        }

        // cek username sudah ada atau belum
        $exists = UserAccount::where('username',$request->username)->first();

        if($exists){
            return response()->json([
                "success"=>false,
                "message"=>"Username sudah digunakan"
            ],409);
        }

        // insert user baru
        $user = UserAccount::create([
            "username"=>$request->username,
            "password"=>$request->password,
            "email"=>$request->email,
            "id_role"=>2 // default user biasa
        ]);

        return response()->json([
            "success"=>true,
            "user"=>$user
        ]);
    }
}
