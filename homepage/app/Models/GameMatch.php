<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Tournament;

class GameMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $primaryKey = 'id_match';

    public $timestamps = false;

    public function tournament()
    {
        return $this->belongsTo(Tournament::class, 'id_tournament', 'id_tournament');
    }

    protected $fillable = [
        'id_tournament',
        'id_team_a',
        'id_team_b',
        'match_format',
        'skor_akhir_a',
        'skor_akhir_b',
        'jadwal'
    ];

}
