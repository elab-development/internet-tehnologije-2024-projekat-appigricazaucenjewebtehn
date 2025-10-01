<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Player;
use App\Http\Requests\V1\StorePlayerRequest;
use App\Http\Requests\V1\UpdatePlayerRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PlayerResource;
use App\Http\Resources\V1\PlayerCollection;
use App\Filters\V1\PlayersFilter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlayerController extends Controller
{
    //GET PLAYERS
    public function index(Request $request)
    {
        try{
            $filter = new PlayersFilter();
            $filterItems = $filter->transform($request); //column operator value

            $includeGames = request()->query('includeGames');

            $players = Player::where($filterItems);
            if($includeGames){
                $players = $players->with('games');
            }

            return new PlayerCollection($players->paginate()->appends($request->query()));
            
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
     * Store a newly created resource in storage.
     */
    //POST PLAYERS
    public function store(StorePlayerRequest $request)
    {
        return new PlayerResource(Player::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    //GET PLAYERS
    public function show(Player $player)
    {
        $includeGames = request()->query('includeGames');

        if($includeGames){
            return new PlayerResource($player->loadMissing('games'));
        }

        return new PlayerResource($player);
    }

    /**
     * Update the specified resource in storage.
     */
    //PUT/PATCH PLAYERS/{id}
    public function update(UpdatePlayerRequest $request, Player $player)
    {
        $player->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    //DELETE PLAYERS/{id}
    public function destroy(Player $player)
    {
        try {
            //proveravamo da li ima igre - inace on delete restrict
                if (method_exists($player, 'games') && $player->games()->exists()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ne moze moda brisemo igraca koji ima asocirane igre',
                        'error' => 'Igrac ima asocirane igre',
                        'player_id' => $player->id,
                        'games_count' => $player->games()->count()
                    ], 422); // 422 Unprocessable Entity
                }

                //brisemo ako nema igre
                $player->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Igrac uspesno obrisan',
                    'deleted_player_id' => $player->id
                ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Nemoguce brosanje igraca',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
