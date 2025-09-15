<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Game;
use App\Http\Requests\V1\StoreGameRequest;
use App\Http\Requests\V1\UpdateGameRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\GameResource;
use App\Http\Resources\V1\GameCollection;
use App\Filters\V1\GamesFilter;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try{
            $filter = new GamesFilter();
            $filterItems = $filter->transform($request); //column operator value

            $includeQuestions = request()->query('includeQuestions');

            $games = Game::where($filterItems);
            
            if($includeQuestions){
                $games = $games->with('questions');
            }
            return new GameCollection($games->paginate()->appends($request->query()));

        } catch (\Illuminate\Database\QueryException $e) {
        // los operator kolona itd
        return response()->json([
            'success' => false,
            'message' => 'Database query error',
            'error' => 'Invalid filter parameters or database error'
        ], 400);
        } catch (\Exception $e) {
        // generalna greska
        return response()->json([
            'success' => false,
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGameRequest $request)
    {
        return new GameResource(Game::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Game $game)
    {
        $includeQuestions = request()->query('includeQuestions');
        if($includeQuestions){
            return new GameResource($game->loadMissing('questions'));
        }
        return new GameResource($game);
    }

    /**
     * Show the form for editing the specified resource.
     */
   

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGameRequest $request, Game $game)
    {
        $game->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Game $game)
    {
        //
    }

    public function topScores(){
        $topPlayers = Game::orderBy('score', 'DESC')
        ->take(10)
        ->get();

        return GameResource::collection($topPlayers);
    }
}
