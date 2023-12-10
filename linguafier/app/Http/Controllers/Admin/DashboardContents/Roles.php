<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class Roles extends Controller
{
    //GET
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/Roles', [
            'popFlash'=>session('popFlash'),
            'pageUser'=>'Special',
            'adminPage'=>"Role",
            'data'=>$this->getContents(),
        ]);
    }

    public function addRole(Request $request){
        return Inertia::render('Admin/DashboardContents/Roles/Add', [
            'popFlash'=>session('popFlash'),
            'pageUser'=>'Special',
            'adminPage'=>"Role",
        ]);
    }

    //POST
    public function changeContents(Request $request){
        //Verify Data
        $request->validate([
            'v_search' => 'nullable|max:256',
        ], [
            'v_search.max'=>'Search Limit Reached My Friend.'
        ]);

        return redirect()->back()->with('v_search', $request->v_search);
    }

    //Functionality
    private function getContents(){

        //Start Fetch
        $data = Role::select();

        //Required Condition

        //Search
        if(session('v_search') ){
            $data = $data->where( function($query){
                $query->where('name', 'LIKE', '%' . session('v_search') . '%');
            });
        }

        //Filters

        // GET
        $data = $data->get();

        return $data;
        /*
        //return Inertia::share('data', $data);
        //return Inertia::render('Admin/DashboardContents/Roles', ['contents'=>$data]);
        //return Redirect::back()->with('data', $data);
        //return response('', 200, ['ff'=>$data]);
        */
    }
}
