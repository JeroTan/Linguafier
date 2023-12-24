<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class CheckId
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $route, $table, $column="id"): Response
    {
        $verifyID = Validator::make(['id'=> $request->route('id')], ['id'=>"required|exists:$table,$column"] );
        if($verifyID->fails()){
            if(session('popFlash')){
                Session::keep('popFlash');
            }
            return redirect()->route($route)->withErrors($verifyID);
            //'popFlash', ['Type'=>'error','Title'=>'ID not Found','Message'=>"Record does not exist in our magical index."]
        }
        return $next($request);
    }
}
