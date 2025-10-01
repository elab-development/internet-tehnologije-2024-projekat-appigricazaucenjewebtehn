<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PremiumMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isPremium()) {
            return response()->json([
                'success' => false,
                'message' => 'Ova funkcionalnost je dostupna samo premium korisnicima.'
            ], 403);
        }

        return $next($request);
    }
}