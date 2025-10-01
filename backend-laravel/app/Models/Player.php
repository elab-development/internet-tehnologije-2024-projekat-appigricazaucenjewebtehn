<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Player extends Model
{
    /** @use HasFactory<\Database\Factories\PlayerFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'password',
        'email',
        'role'
    ];

    protected $attributes = [
        'role' => 'user' //podrazumevana uloga
    ];

    const ROLES = [
        'admin' => 'Administrator',
        'premium' => 'Premium Korisnik', 
        'user' => 'Običan Korisnik'
    ];

    //za proveru uloga
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isPremium() 
    {
        return $this->role === 'premium' || $this->isAdmin();
    }

    public function isUser()
    {
        return $this->role === 'user';
    }

    public function games(){
        return $this->hasMany(Game::class);
    }
}
