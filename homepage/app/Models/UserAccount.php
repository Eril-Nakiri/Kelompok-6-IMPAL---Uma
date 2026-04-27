<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAccount extends Model
{
    protected $table='users';

    protected $fillable=[
        'username',
        'password',
        'email',
        'id_role'
    ];

    public $timestamps=false;
}
