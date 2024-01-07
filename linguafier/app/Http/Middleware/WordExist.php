<?php

namespace App\Http\Middleware;

use App\Models\Word;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WordExist
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if( !Word::find($request->route('id')) ){
            return redirect()->route('home');
        }
        return $next($request);
    }
}
