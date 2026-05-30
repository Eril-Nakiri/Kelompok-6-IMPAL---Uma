<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;
    protected $table = 'tournaments';

    protected $primaryKey = 'id_tournament';

    public $timestamps = false;
    
    protected $fillable = [
        'nama_turnamen',
        'penyelenggara',
    ];
}
