<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\GameMatch;

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

    public function matches()
    {
        return $this->hasMany(GameMatch::class, 'id_tournament', 'id_tournament');
    }
}
