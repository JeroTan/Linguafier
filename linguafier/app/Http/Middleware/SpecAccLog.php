<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SpecAccLog
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$type): Response
    {
        if(  ( $type[0] == 'on' && session('SpecialAccount', false) )  || ( $type[0] == 'off' && !session('SpecialAccount', false) ) ){
            return $next($request);
        }elseif($type[0] == 'on'){
            return redirect(route('admin.login'));
        }elseif($type[0] == 'off'){
            return redirect(route('admin.dashboard'));
        }


    }
}
