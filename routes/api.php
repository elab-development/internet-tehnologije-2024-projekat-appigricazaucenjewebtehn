<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\GameController;

//Route::get('/games/top-scores', [GameController::class, 'topScores']);

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1'], function(){

    Route::get('/games/top-scores', [GameController::class, 'topScores']);

    Route::apiResource('players', PlayerController::class);
    Route::apiResource('games', GameController::class);
    Route::apiResource('questions', QuestionController::class);
});



