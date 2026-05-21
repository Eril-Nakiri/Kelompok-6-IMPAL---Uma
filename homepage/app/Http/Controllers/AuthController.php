<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAccount;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

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
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $exists = UserAccount::where('username', $request->username)->first();

        if ($exists) {
            return response()->json([
                "success" => false,
                "message" => "Username sudah digunakan"
            ], 409);
        }

        $user = UserAccount::create([
            "username" => $request->username,
            "password" => $request->password,
            "email" => $request->email,
            "id_role" => 2
        ]);

        return response()->json([
            "success" => true,
            "user" => $user
        ]);
    }

    public function verifyForgotAccount(Request $request)
        {
            $request->validate([
                'username' => 'required|string',
                'email' => 'required|email'
            ]);

            // Mencari akun yang username DAN email-nya cocok sekaligus
            $user = UserAccount::where('username', $request->username)
                ->where('email', $request->email)
                ->first();

            if ($user) {
                return response()->json([
                    "success" => true,
                    "message" => "Akun terverifikasi. Silakan lakukan reset password.",
                    "user_id" => $user->id // Mengembalikan ID untuk proses update password selanjutnya jika diperlukan
                ]);
            }

            return response()->json([
                "success" => false,
                "message" => "Kombinasi Username dan Email tidak ditemukan di database!"
            ], 404);
        }
    }
