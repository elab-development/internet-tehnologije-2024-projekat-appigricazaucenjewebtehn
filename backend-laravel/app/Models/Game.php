<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    /** @use HasFactory<\Database\Factories\GameFactory> */
    use HasFactory;

    protected $fillable = [
        'player_id',
        'score',
        'completed'
    ];

    public function player(){
        return $this->belongsTo(Player::class);
    }

    public function questions(){
        return $this->hasMany(Question::class);
    }

}
