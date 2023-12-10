<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\SpecialAccount;
use Illuminate\Http\Request;

class Login extends Controller
{
    public function __invoke(Request $request){
        return Inertia::render('Admin/Login', ['popFlash'=> session('popFlash')]);
    }

    public function LoginVerified(Request $request){
        //Verify Data
        $request->validate([
            'v_username' => 'required|alpha_num|max:32',
            'v_password' => 'required|max:255',
        ], [
            'v_username.required' => 'Username is required to enter the realm.',
            'v_username.alpha_num' => 'Username only accept alphabets and numbers so cast your magic name again.',
            'v_username.max'=>'Oops! You have reach the word limit of Username. Now, reduce it below 32 symbols.',
            'v_password.required' => 'Password is required to enter the realm.',
            'v_password.max'=>'I know you are skeptikal with password strength but it has a limit too.'
        ]);


        //Verify Login Credentials
        $userData = SpecialAccount::select('specialaccount.*', 'role.name AS rolename', 'role.privilege AS privilege')->join('role', 'specialaccount.role_id', '=', 'role.id')->where('password', $request->v_password)->where('username', $request->v_username)->first();
        if(!$userData){
            return redirect()->route('admin.login')->with( 'popFlash', ['Title'=>'Mismatch','Message'=>"Your Username and Password did not match in our library. Please cast your credentials again."] );
        }

        //Finally Add Session
        session()->put('SpecialAccount', [
            'id' => $userData->id,
            'username' => $userData->username,
            'rolename' => $userData->rolename,
            'role_id' => $userData->role_id,
            'privilege' => $userData->privilege,
            'login' => true,
        ]);
        //return redirect()->route('admin.login');
    }

    public function Logout(Request $request){
        session()->forget('SpecialAccount');
        return redirect()->route('admin.login');
    }
}
