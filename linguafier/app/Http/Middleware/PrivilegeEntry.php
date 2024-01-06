<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PrivilegeEntry
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $privName): Response
    {
        $list = $request->session()->get('SpecialAccount');
        if(   !$list || !json_decode($list['privilege'], true)[$privName]  ){
            return redirect()->route('admin.dashboard');
        }
        return $next($request);
    }
}
