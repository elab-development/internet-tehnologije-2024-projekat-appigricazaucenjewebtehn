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
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{

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

    public function topScores(Request $request){
        try {
            $query = DB::table('games')
                ->join('players', 'games.player_id', '=', 'players.id')
                ->select(
                    'games.id',
                    'games.score',
                    'games.completed',
                    'games.created_at',
                    'players.name as player_name',
                    'players.email as player_email'
                )
                ->where('games.completed', true)
                ->orderBy('games.score', 'DESC');

            if ($request->has('playerName') && !empty($request->playerName)) {
                $query->where('players.name', 'like', '%' . $request->playerName . '%');
            }

            if ($request->has('minScore') && !empty($request->minScore)) {
                $query->where('games.score', '>=', $request->minScore);
            }

            if ($request->has('maxScore') && !empty($request->maxScore)) {
                $query->where('games.score', '<=', $request->maxScore);
            }

            if ($request->has('dateFrom') && !empty($request->dateFrom)) {
                $query->whereDate('games.created_at', '>=', $request->dateFrom);
            }

            if ($request->has('dateTo') && !empty($request->dateTo)) {
                $query->whereDate('games.created_at', '<=', $request->dateTo);
            }

            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);
            
            $results = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'data' => $results->items(),
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
                'per_page' => $results->perPage(),
                'total' => $results->total(),
                'from' => $results->firstItem(),
                'to' => $results->lastItem(),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching top scores: ' . $e->getMessage());
            return response()->json([
                'message' => 'Došlo je do greške pri učitavanju podataka',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function markAsComplete($id){
        $game = Game::findOrFail($id);
        $game->update([
            'completed' => true
        ]);
    }

}


