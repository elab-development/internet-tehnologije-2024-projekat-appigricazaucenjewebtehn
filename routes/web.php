<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Requests;
use App\Http\Controllers\Api\V1\PlayerAuthController;
use App\Http\Middleware\AuthCheck;
use App\Http\Middleware\AlreadyLoggedIn;

Route::get('/', function () {
    //return view('welcome');
    return redirect('/setup');
});

Route::get('/setup', function(){
    $credentials = [
        'email'=>'admin@admin.com',
        'password'=>'password'
    ];

    if(!Auth::attempt($credentials)){
        $user = new \App\Models\User();

        $user->name='Admin';
        $user->email=$credentials['email'];
        $user->password=Hash::make($credentials['password']);

        $user->save();
    }
    if(Auth::attempt($credentials)){
        $user = Auth::user();

        $adminToken = $user->createToken('admin-token', ['create', 'update', 'delete']);
        $updateToken = $user->createToken('update-token', ['create', 'update']);
        $basicToken = $user->createToken('basic-token');

        return [
            'admin'=> $adminToken->plainTextToken,
            'update'=> $updateToken->plainTextToken,
            'basic'=> $basicToken->plainTextToken,
        ];
    }

});

Route::get('/login', [PlayerAuthController::class, 'login'])->middleware('already.check');
Route::get('/registration', [PlayerAuthController::class, 'registration'])->middleware('already.check');
Route::post('/register-player', [PlayerAuthController::class, 'registerPlayer'])->name('register-player');
Route::post('/login-player', [PlayerAuthController::class, 'loginPlayer'])->name('login-player');
Route::get('/dashboard', [PlayerAuthController::class, 'dashboard'])->middleware('auth.check');
Route::get('/logout', [PlayerAuthController::class, 'logout']);

