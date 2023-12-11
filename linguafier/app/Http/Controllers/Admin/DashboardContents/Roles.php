<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Role;
use HelpMoKo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;

class Roles extends Controller
{
    //GET
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/Roles', [
            'pageUser'=>'Special',
            'adminPage'=>"Role",
            'data'=>$this->getContents(),
        ]);
    }

    public function addRole_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/Roles/Add', [
            'pageUser'=>'Special',
            'adminPage'=>"Role",
        ]);
    }

    public function modifyRole_UI(Request $request, $id){
        return Inertia::render('Admin/DashboardContents/Roles/Modify', [
            'pageUser'=>'Special',
            'adminPage'=>"Role",
            'roleId'=>$id,
            'data'=>Role::find($id),
        ]);
    }

    //POST
    public function changeContents(Request $request){ //Modify the contents by search or filter or sort
        //Verify Data
        $request->validate([
            'v_search' => 'nullable|max:256',
        ], [
            'v_search.max'=>'Search Limit Reached My Friend.'
        ]);

        return redirect()->back()->with('v_search', $request->v_search);
    }
    public function create(Request $request){ // Verify and add if verified
        //Verify Data
        $request->validate([
            'v_name' => 'required|regex:/^[a-zA-Z0-9\,\.\s]*$/|max:32',
            'v_mSpecialUser' => 'boolean',
            'v_mWizard' => 'boolean',
            'v_mWizardRank' => 'boolean',
            'v_mWordLibrary' => 'boolean',
            'v_mWordAttributes' => 'boolean',
            'v_mRoles' => 'boolean',
        ], [
            'v_name.required'=>'Name of the role is required.',
            'v_name.regex'=>'Name of the role must contain only letters and number.',
            'v_name.max'=>"Name of the role character limit reached. The maximum is 32 characters.",
            'v_mSpecialUser.boolean'=>'Privileges must be true or false only',
            'v_mWizard.boolean'=>'Privileges must be true or false only',
            'v_mWizardRank.boolean'=>'Privileges must be true or false only',
            'v_mWordLibrary.boolean'=>'Privileges must be true or false only',
            'v_mWordAttributes.boolean'=>'Privileges must be true or false only',
            'v_mRoles.boolean'=>'Privileges must be true or false only',
        ]);

        //Compile Data
        $privileges = [
            'Manage Special User'=>$request->v_mSpecialUser,
            'Manage Wizard'=>$request->v_mWizard,
            'Manage Wizard Rank'=>$request->v_mWizardRank,
            'Manage Word Library'=>$request->v_mWordLibrary,
            'Manage Word Attributes'=>$request->v_mWordAttributes,
            'Manage Roles'=>$request->v_mRoles,
        ];

        //Create New Role
        $newRole = new Role;
        $newRole->id = HelpMoKo::generateID('OnlyMeChanics');
        $newRole->name = $request->v_name;
        $newRole->privilege = json_encode($privileges);
        $newRole->save();

        //Return Success
        return redirect()->back()->with( 'popFlash', [
            'Type'=>'success',
            'Title'=>'Created Successfully',
            'Message'=>"A new role name \"".$newRole->name."\" was added to the magic system.",
        ]);
    }

    public function modify(Request $request, $id){
        // Check if it is the Owner Role or the ID == 1
        $validatingData = ['v_name' => 'required|regex:/^[a-zA-Z0-9\,\.\s]*$/|max:32',];
        $validatingMessage = [
            'v_name.required'=>'Name of the role is required.',
            'v_name.regex'=>'Name of the role must contain only letters and number.',
            'v_name.max'=>"Name of the role character limit reached. The maximum is 32 characters.",
        ];
        if($id != "1"){
            $validatingData = [...$validatingData,
                'v_mSpecialUser' => 'boolean',
                'v_mWizard' => 'boolean',
                'v_mWizardRank' => 'boolean',
                'v_mWordLibrary' => 'boolean',
                'v_mWordAttributes' => 'boolean',
                'v_mRoles' => 'boolean',
            ];
            $validatingMessage = [...$validatingMessage,
                'v_mSpecialUser.boolean'=>'Privileges must be true or false only',
                'v_mWizard.boolean'=>'Privileges must be true or false only',
                'v_mWizardRank.boolean'=>'Privileges must be true or false only',
                'v_mWordLibrary.boolean'=>'Privileges must be true or false only',
                'v_mWordAttributes.boolean'=>'Privileges must be true or false only',
                'v_mRoles.boolean'=>'Privileges must be true or false only',
            ];
        }

        //Verify Data
        $request->validate($validatingData, $validatingMessage);
        $verifyID = Validator::make(['id'=> $id], ['id'=>'required|exists:role,id'], [
            'required'=>"ID is required",
            'exists'=>"Record does not exist in our magical index"
        ] );
        if($verifyID->fails()){
            return redirect()->back()->withErrors($verifyID)->with('popFlash', ['Type'=>'error','Title'=>'ID not Found','Message'=>"Record does not exist in our magical index."]);
        }

        //Compile Data
        if($id != "1"){
            $privileges = [
                'Manage Special User'=>$request->v_mSpecialUser,
                'Manage Wizard'=>$request->v_mWizard,
                'Manage Wizard Rank'=>$request->v_mWizardRank,
                'Manage Word Library'=>$request->v_mWordLibrary,
                'Manage Word Attributes'=>$request->v_mWordAttributes,
                'Manage Roles'=>$request->v_mRoles,
            ];
        }

        //Update Roie
        $role = Role::find($id);
        $role->name = $request->v_name;
        if($id != "1")
            $role->privilege = json_encode($privileges);
        $role->save();

        //Optional** Change the session name of Role if match
        if(session('SpecialAccount')['role_id'] == $id){
            $sessionOld = session('SpecialAccount');
            $sessionOld['rolename'] = $role->name;
            session()->put('SpecialAccount', $sessionOld);
        }

        //Return Success
        return redirect()->back()->with( 'popFlash', [
            'Type'=>'success',
            'Title'=>'Modified Successfully',
            'Message'=>"A role name \"".$role->name."\" was modified in the magic system.",
        ]);
    }

    public function delete(Request $request, $id){
        //Verify
        $verifyID = Validator::make(['id'=> $id], ['id'=>'required|exists:role,id'], [
            'required'=>"ID is required",
            'exists'=>"Record does not exist in our magical index"
        ] );
        if($verifyID->fails()){
            return redirect()->back()->withErrors($verifyID)->with('popFlash', ['Type'=>'error','Title'=>'ID not Found','Message'=>"Record does not exist in our magical index."]);
        }

        //Delete the Role
        $roleName = Role::find($id)['name'];
        Role::destroy($id);

        //Optional** Delete the current session if the Account is associated with the role ID
        if(session('SpecialAccount')['role_id'] == $id){
            session()->forget('SpecialAccount');
        }

        //Return Success
        return redirect()->back()->with( 'popFlash', [
            'Type'=>'success',
            'Title'=>'Deleted Successfully',
            'Message'=>"A role name \"".$roleName."\" was removed from the magic system.",
        ]);
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
