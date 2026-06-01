<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAccount;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
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
        $tableName = (new UserAccount())->getTable();

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:' . $tableName . ',username',
            'email' => 'required|email|unique:' . $tableName . ',email',
            'password' => 'required|string',
        ], [
            'username.unique' => 'Username sudah digunakan, silakan pilih yang lain.',
            'email.unique' => 'Email sudah terdaftar, silakan gunakan email lain.',
            'email.email' => 'Format email yang dimasukkan tidak valid.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()->first()
            ], 400);
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
}
