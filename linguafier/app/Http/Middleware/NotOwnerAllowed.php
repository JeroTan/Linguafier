<?php

namespace App\Http\Middleware;

use App\Models\SpecialAccount;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NotOwnerAllowed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $thereIsID = false): Response
    {
        $carryID = false;
        if($thereIsID){
            $data = SpecialAccount::find($request->route('id'));
            if(!$data){
                abort('404', 'Invalid Action. Please Try Again.');

            if($data->role_id == 1)
                $carryID = true;
        }


        }// Find out if the id that will be access is an owner role because it is not allowed to edit not unless user is the owner.
        if( ($thereIsID ? $carryID : true) && session('SpecialAccount')['role_id'] != 1){
            return redirect()->back();
        }
        return $next($request);
    }
}
