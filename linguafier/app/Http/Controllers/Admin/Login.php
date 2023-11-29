<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class Login extends Controller
{
    public function __invoke(){
        return Inertia::render('Admin/Login');
    }

    public function LoginVerified(Request $request){

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
        return redirect()->route('admin.login');
    }
}
