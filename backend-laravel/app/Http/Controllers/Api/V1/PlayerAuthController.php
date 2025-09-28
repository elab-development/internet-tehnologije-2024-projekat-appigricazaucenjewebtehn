<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Player;
use Hash;
use Session;

class PlayerAuthController extends Controller
{
    public function login(){
        return view("auth.login");
    }
    public function registration(){
        return view("auth.registration");
    }
    public function registerPlayer(Request $request){
        $request->validate([
            'name'=>['required'],
            'password'=>['required'],
            'email'=>['required', 'email']
        ]);
        $player = new Player();
        $player->name = $request->name;
        $player->email = $request->email;
        $player->password = $request->password;
        $res = $player->save();
        if($res){
            return back()->with('success', 'You have registered successfully');
        }else{
            return back()->with('fail', 'Something wrong');
        }
    }

    public function loginPlayer(Request $request){
        $request->validate([
            'password'=>['required'],
            'email'=>['required', 'email']
        ]);
        $player = Player::where('email', '=', $request->email)->first();
        if($player){
            if($request->password == $player->password){
                $request->session()->put('loginId', $player->id);
                return redirect('dashboard');
            }else{
                return back()->with('fail', 'Wrong password');
            }
            return back()->with('success', 'Log in successful');
        }else{
            return back()->with('fail', 'Not registered');
        }
    }

    public function dashboard(){
        $data = array();
        if(Session::has('loginId')){
            $data = Player::where('id', '=', Session::get('loginId'))->first();
        }
        return view('dashboard', compact('data'));
    }

    public function logout(){
        if(Session::has('loginId')){
            Session::pull('loginId');
            return redirect('login');
        }
    }

}
