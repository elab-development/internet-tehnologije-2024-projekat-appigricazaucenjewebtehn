<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\V1\PlayerResource;

class AuthController extends Controller
{
    public function login(Request $request) : JsonResponse {
        $request->validate([
            'password'=>['required'],
            'email'=>['required', 'email']
        ]);
        $player = Player::where('email', $request->email)->first();
        if(!$player || !Hash::check($request->password, $player->password)){
            return response()->json([
                'message' => 'Incorrect credentials'
            ], 401);
        }
        $token = $player->createToken($player->name.'Auth-Token')->plainTextToken;
        return response()->json([
            'message'=>'Login successfull',
            'token_type'=>'Bearer',
            'token'=>$token
        ], 200);
    }

    public function register(Request $request): JsonResponse{
        $request->validate([
            'name'=>['required'],
            'password'=>['required'],
            'email'=>['required', 'email', 'unique:players,email']
        ]);
        $player = Player::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=> Hash::make($request->password),
        ]);
        if($player){
            $token = $player->createToken($player->name.'Auth-Token')->plainTextToken;
            return response()->json([
            'message'=>'Login successfull',
            'token_type'=>'Bearer',
            'token'=>$token
            ], 201);
        } else{
            return response()->json([
            'message'=>'Bad registration'
            ], 500);
        }
        
    }

    public function profile(Request $request){
        if($request->user()){
            return response()->json([
                'message'=>'Profile fetched',
                'data'=> $request->user()
            ], 200);
        }else{
            return response()->json([
                'message'=>'Not authenticated'
            ], 401);
        }
    }

    public function logout(Request $request){
        $player = Player::where('id', $request->user()->id)->first();
        if($player){
            $player->tokens()->delete();
            return response()->json([
                'message'=>'Logged out'
            ], 200);
        } else {
            return response()->json([
                'message'=>'No user found'
            ], 404);
        }
    }

}
