<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class Roles extends Controller
{
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/Roles', [
            'popFlash'=>session('popFlash'),
            'pageUser'=>'Special',
            'privilege'=>false,
            'adminPage'=>"Role",
            'data'=>session('data'),
        ]);
    }

    private function getContents($search, $filter){
        //Start Fetch
        $data = Role::select();

        //Required Condition


        //Search
        if($search){
            $data = $data->where( function($query){
                $query->where('DepartmentName', 'LIKE', '%' . request('v_search') . '%');
            });
        }

        //Filters


        // GET
        $data = $data->get();
        $data = $data->toJson();
        //return Inertia::share('data', $data);
        //return Inertia::render('Admin/DashboardContents/Roles', ['contents'=>$data]);
        return Redirect::back()->with('data', $data);
        //return response('', 200, ['ff'=>$data]);
    }

    public function changeContents(Request $request){
        //Verify Data
        $request->validate([
            'v_search' => 'nullable|max:256',
        ], [
            'v_search.max'=>'Search Limit Reached My Friend.'
        ]);


    }
}
