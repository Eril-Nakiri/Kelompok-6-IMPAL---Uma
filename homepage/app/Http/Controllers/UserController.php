<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAccount;
use Illuminate\Support\Facades\Validator;

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
        // Mendapatkan instance nama tabel dari model UserAccount secara dinamis
        $tableName = (new UserAccount())->getTable();

        // --- ALGORITMA VALIDASI SERVER-SIDE (DATABASE CEK UNIQUE) ---
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:' . $tableName . ',username',
            'email' => 'required|email|unique:' . $tableName . ',email',
            'password' => 'required|string',
        ], [
            // Kustomisasi pesan respon JSON untuk sisi client React
            'username.unique' => 'Username sudah digunakan, silakan pilih yang lain.',
            'email.unique' => 'Email sudah terdaftar, silakan gunakan email lain.',
            'email.email' => 'Format email yang dimasukkan tidak valid.',
        ]);

        // Jika salah satu aturan unique atau format email gagal, kirim respon error ke React
        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()->first()
            ], 400);
        }

        // Jika validasi database lolos, buat baris data akun baru
        $user = UserAccount::create([
            "username" => $request->username,
            "password" => $request->password, // Disarankan nantinya di-hash memakai bcrypt($request->password) demi keamanan IMPAL
            "email" => $request->email,
            "id_role" => 2
        ]);

        return response()->json([
            "success" => true,
            "user" => $user
        ]);
    }
}
