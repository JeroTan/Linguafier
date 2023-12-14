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
    // CONSTRUCTOR
    protected $sortKey = ['username', 'rolename', 'created_time', 'modified_time'];
    protected function filter(){
        $roles = [];
        foreach(Role::all() as $key => $val){
            $roles[$key] = $val->name;
        }

        return [ ['rolename', "checklist", $roles], ['created_time', "range_date",], ['modified_time',"range_date"],];
    }

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
        $toFilter = [];
        try{
            foreach($this->filter() as $key => $val){
                $Data = $request->v_filter[$key]['Data'];
                $toFilter[$key] = [$val[0], $val[1], []];
                if($val[1] == "radio"){
                    $toFilter[$key][2] = $Data["Selected"];
                }elseif($val[1] == "checklist"){
                    foreach($val[2] as $key => $val2){
                        if($Data[$key]["Value"] == true){
                            $toFilter[$key][2][ count($toFilter[$key][2]) ] = $val2;
                        }
                    }
                }elseif($val[1] == "range"){
                    if(!$Data['Min']){
                        $Data['Min']="0";
                    }
                    if(!$Data['Max']){
                        $Data['Max']="999999999999999";
                    }
                    $rangeValidation = Validator::make(
                        [ 'Min'=>$Data["Min"],
                            'Max'=>$Data["Max"] ],

                        [ 'Min'=>"required|numeric|between:".$val[2][0].",".$val[2][1]."|lte:".$Data["Max"],
                            'Max'=>"required|numeric|between:".$val[2][0].",".$val[2][1]."|gte:".$Data["Min"],  ],
                    );
                    if($rangeValidation->fails()){
                        return redirect()->back()->withErrors($rangeValidation);
                    }
                    $toFilter[$key][2] = ["Min"=>$Data['Min'], "Max"=>$Data['Max'] ];
                }elseif($val[1] == "range_date"){
                    if(!$Data['Min']){
                        $Data['Min']="0001-01-01T12:00";
                    }
                    if(!$Data['Max']){
                        $Data['Max']="9999-12-31T12:59";
                    }
                    $rangeValidation = Validator::make(
                        [ 'Min'=>$Data["Min"],
                            'Max'=>$Data["Max"], ],
                        [ 'Min'=>"required|date|before_or_equal:".$Data['Max'],
                            'Max'=>"required|date|after_or_equal:".$Data['Min'], ]  );
                    if($rangeValidation->fails()){
                        return redirect()->back()->withErrors($rangeValidation);
                    }
                    $toFilter[$key][2] = ["Min"=>$Data['Min'], "Max"=>$Data['Max'] ];
                }
            }
        }catch(Throwable $e){
            return redirect()->back()->withErrors($e);
        }

        //Sort
        $sortKeyVerify = [];
        $sortKeyRule = [];
        $sortVerify = [];
        $sortRule = [];
        try{
            foreach($request->v_sort as $key => $val){
                $sortKeyVerify["sortKey".$key] = $val['Ref'];
                $sortKeyRule["sortKey".$key] = 'required|in:'.implode(',', $this->sortKey);
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
        return redirect()->back()->with(['v_search'=>$request->v_search, 'v_sort'=>$request->v_sort, 'v_filter'=>$toFilter]);
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
                $query->orwhere('specialaccount.username', 'LIKE', '%' . session('v_search') . '%');
                $query->orwhere('specialaccount.created_time', 'LIKE', '%' . session('v_search') . '%');
                $query->orwhere('specialaccount.modified_time', 'LIKE', '%' . session('v_search') . '%');
                $query->orwhere('role.name', 'LIKE', '%' . session('v_search') . '%');
            });
        }

        //Filters
        if(session('v_filter') ){
            foreach(session('v_filter') as $key=>$val){
                if($val[1] == 'radio' && $val[2]){
                    $data = $data->where($val[0], $val[2]);
                }elseif($val[1] == 'checklist' && !empty($val[2]) ){
                    $data = $data->whereIn($val[0], $val[2]);
                }elseif( $val[1] == 'range' || $val[1] == 'range_date' ){
                    $data = $data->whereBetween( $val[0], [ $val[2]['Min'], $val[2]['Max']  ] );
                }
            }
        }

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
