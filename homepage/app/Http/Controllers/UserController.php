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

    public function index()
    {
        try {
            $users = \Illuminate\Support\Facades\DB::table('users')
                ->leftJoin('roles', 'users.id_role', '=', 'roles.id_role')
                ->select('users.id_user', 'users.username', 'users.email', 'roles.role_name as role')
                ->orderBy('users.id_user', 'asc')
                ->get();

            return response()->json(['status' => 'success', 'data' => $users], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil data user: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            if ($id == 1) {
                return response()->json(['status' => 'error', 'message' => 'Dilarang menghapus Super Admin!'], 403);
            }

            $deleted = \Illuminate\Support\Facades\DB::table('users')->where('id_user', $id)->delete();

            if ($deleted) {
                return response()->json(['status' => 'success', 'message' => 'Akun berhasil dihapus!'], 200);
            }

            return response()->json(['status' => 'error', 'message' => 'Akun tidak ditemukan.'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus akun: ' . $e->getMessage()], 500);
        }
    }

    public function storeAdmin(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        try {
            $lastUser = \Illuminate\Support\Facades\DB::table('users')->max('id_user') ?? 0;

            \Illuminate\Support\Facades\DB::table('users')->insert([
                'id_user' => $lastUser + 1,
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'id_role' => 1,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Admin baru berhasil direkrut!'], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal membuat admin: ' . $e->getMessage()], 500);
        }
    }
}
