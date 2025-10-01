<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Nedozvoljen pristup. Samo administratori mogu pristupiti ovoj funkcionalnosti.'
            ], 403);
        }

        return $next($request);
    }
}