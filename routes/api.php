<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\GameController;
use App\Http\Controllers\Api\V1\QuestionController;

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1'], function(){
    Route::get('/questions/download-csv', [QuestionController::class, 'downloadCSV']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//, 'middleware' => 'auth:sanctum'
Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1', 'middleware' => 'auth:sanctum'], function(){

    Route::get('/games/top-scores', [GameController::class, 'topScores']);
    Route::post('/games/{id}/complete', [GameController::class, 'markAsComplete']);
    Route::delete('/questions/{id}/force-delete', [QuestionController::class, 'forceDelete']);

    //Route::get('/questions/download-csv', [QuestionController::class, 'downloadCSV']);
    Route::apiResource('players', PlayerController::class);
    Route::apiResource('games', GameController::class);
    Route::apiResource('questions', QuestionController::class);
});



