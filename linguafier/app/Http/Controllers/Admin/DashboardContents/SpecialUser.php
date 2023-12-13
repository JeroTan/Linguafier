<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\SpecialAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Event\Code\Throwable;

class SpecialUser extends Controller
{
    // GET
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/SpecialUser', [
            'pageUser'=>'Special',
            'adminPage'=>"User",
            'data'=>$this->getContents(),
            'roles'=>Role::all(),
        ]);
    }
    public function add_UI(Request $request, $id){
        $data = SpecialAccount::select('specialaccount.id', 'specialaccount.username', 'specialaccount.created_time', 'specialaccount.modified_time', 'role.name AS rolename', 'role.privilege AS privilege')->join('role', 'specialaccount.role_id', '=', 'role.id')->whereNot('specialaccount.role_id', '1')->where('specialaccount.id', $id);

        return Inertia::render('Admin/DashboardContents/SpecialUser/add', [
            'pageUser'=>'Special',
            'adminPage'=>"User",
            'data'=>$data,
        ]);
    }
    public function modify_UI(Request $request, $id){
        $data = SpecialAccount::select('specialaccount.id', 'specialaccount.username', 'specialaccount.created_time', 'specialaccount.modified_time', 'role.name AS rolename', 'role.privilege AS privilege')->join('role', 'specialaccount.role_id', '=', 'role.id')->whereNot('specialaccount.role_id', '1')->where('specialaccount.id', $id);

        return Inertia::render('Admin/DashboardContents/SpecialUser/modify', [
            'pageUser'=>'Special',
            'adminPage'=>"User",
            'data'=>$data,
        ]);
    }

    // POST
    public function changeContents(Request $request){
        //Verify Data
        //Search
        $request->validate([
            'v_search' => 'nullable|max:256',
            'v_sort' => 'required',
        ], [
            'v_search.max'=>'Search Limit Reached My Friend.'
        ]);
        //Filter | Range | Checklist | Radio | Text


        //Sort
        $sortKey = ['username', 'rolename', 'created_time', 'modified_time'];
        $sortKeyVerify = [];
        $sortKeyRule = [];
        $sortVerify = [];
        $sortRule = [];
        try{
            foreach($request->v_sort as $key => $val){
                $sortKeyVerify["sortKey".$key] = $val['Ref'];
                $sortKeyVerify["sortKey".$key] = 'required|in:'.implode(',', $sortKey);
                $sortVerify[$val['Ref']] = $val['Sort'];
                $sortRule[$val['Ref']] = 'required|in:ASC,DESC';
            };
        }catch(Throwable $e){
            return redirect()->back()->withErrors($e);
        }
        $sortKeyValidate = Validator::make($sortKeyVerify, $sortKeyRule );
        if($sortKeyValidate->fails()){
            return redirect()->back()->withErrors($sortKeyValidate);
        }
        $sortValidate = Validator::make($sortVerify, $sortRule );
        if($sortValidate->fails()){
            return redirect()->back()->withErrors($sortValidate);
        }


        return redirect()->back()->with(['v_search'=>$request->v_search, 'v_sort'=>$request->v_sort]);
    }
    public function add_submit(Request $request){

    }
    public function modify_submit(Request $request){

    }
    public function delete(Request $request){

    }

    // Functionality
    public function getContents(){
        //Start Fetch
        $data = SpecialAccount::select('specialaccount.*', 'role.name AS rolename', 'role.privilege AS privilege')->join('role', 'specialaccount.role_id', '=', 'role.id');

        //Required Condition

        //Search
        if(session('v_search') ){
            $data = $data->where( function($query){
                $query->where('specialaccount.username', 'LIKE', '%' . session('v_search') . '%');
                $query->where('specialaccount.created_time', 'LIKE', '%' . session('v_search') . '%');
                $query->where('specialaccount.modified_time', 'LIKE', '%' . session('v_search') . '%');
                $query->where('role.name', 'LIKE', '%' . session('v_search') . '%');
            });
        }

        //Filters


        //Sort
        if(session('v_sort')){
            foreach(session('v_sort') as $key => $val){
                $data = $data->orderBy($val['Ref'], $val['Sort']);
            }
        }


        // GET
        $data = $data->paginate(15)->onEachSide(2);

        return $data;
    }

}
