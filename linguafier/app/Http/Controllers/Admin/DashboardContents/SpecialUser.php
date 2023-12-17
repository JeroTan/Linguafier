<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\SpecialAccount;
use HelpMoKo;
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

        return [ ['role.name', "checklist", $roles], ['created_time', "range_date",], ['modified_time',"range_date"],];
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
    public function add_UI(Request $request){

        return Inertia::render('Admin/DashboardContents/SpecialUser/Add', [
            'pageUser'=>'Special',
            'adminPage'=>"User",
            'roles'=>$this->getRoles(),
        ]);
    }
    public function modify_UI(Request $request, $id){
        $data = $this->getAccount($id);

        return Inertia::render('Admin/DashboardContents/SpecialUser/Modify', [
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
                    foreach($val[2] as $key2 => $val2){
                        if($Data[$key2]["Value"] == true){
                            array_push($toFilter[$key][2], $val2);
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
    public function add_roleSearch(Request $request){
        //Search
        $request->validate([
            'v_search' => 'nullable|max:256',
        ], [
            'v_search.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_search", $request->v_search);
    }
    public function add_submit(Request $request){
        ///// VERIFY THAT THE DATA IS NOT OWNER ROLE
        //Verify Data
        $request->validate(...$this->quickValidate());

        //Compile Data


        //Create New Role
        $newAccount = new SpecialAccount;
        $newAccount->id = HelpMoKo::generateID('OnlyMeChanics', 8);
        $newAccount->username = $request->v_username;
        $newAccount->password = $request->v_password;
        $roleId = Role::select('id')->where('name', $request->v_role)->first()->id;
        $newAccount->role_id = $roleId;
        $newAccount->modified_time = now();
        $newAccount->save();

        //Return Success
        return redirect()->back()->with( 'popFlash', [
            'Type'=>'success',
            'Title'=>'Created Successfully',
            'Message'=>"A new account name \"".$newAccount->username."\" was added to the magic system.",
        ]);

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
    public function getAccount($id){
        $data = SpecialAccount::select('specialaccount.id', 'specialaccount.username', 'specialaccount.created_time', 'specialaccount.modified_time', 'role.name AS rolename', 'role.privilege AS privilege')->join('role', 'specialaccount.role_id', '=', 'role.id')->whereNot('specialaccount.role_id', '1')->where('specialaccount.id', $id);
        return $data;
    }
    public function getRoles(){
        $data = Role::select('name');
        //Requirement
        $data = $data->whereNot('id', 1);

        //Search
        if( session('v_search') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(name) LIKE '%". addslashes(strtolower(session('v_search')))."%'");
            });
        }
        return $data->get();
    }
    protected function quickValidate($type = "add"){
        $rules = [ 'v_username' => 'required|regex:/^[a-zA-Z0-9\,\.\s]*$/|max:32|unique:specialaccount,username',
        'v_role' => 'required|regex:/^[a-zA-Z0-9\,\.\s]*$/|max:32|exists:role,name|not_in:'.Role::find(1)->name,
        'v_password' => 'required|max:128',];
        $message = ['v_username.required'=>'Name of the account is required.',
        'v_username.regex'=>'Name of the account must contain only letters and number.',
        'v_username.max'=>"Name of the account character limit reached. The maximum is 32 characters.",
        'v_username.unique'=>"Name of the account is already existed in the system.",
        'v_role.required'=>'Please indicate the role of this user.',
        'v_role.regex'=>'Role contains foreign symbols thus it is not existed in our magic system.',
        'v_role.max'=>"Role seems exceed the maximum character limit thus it is not existed in our magic system.",
        'v_role.exists'=>"Role does not exist in our magic system.",
        'v_role.not_in'=>"Role does not exist in our magic system.",
        'v_password.required'=>'Please provide passsword for this user.',
        'v_password.max'=>'The maximum password character limit is 128. Please reduce the total character amount.',];
        return [$rules, $message];
    }

}
