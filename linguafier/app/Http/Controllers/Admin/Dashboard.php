<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class Dashboard extends Controller
{
    public function __invoke(Request $request){
        return Inertia::render('Admin/MainDashboard', [
            'pageUser'=>'Special',
            'adminPage'=>"Dashboard",
        ]);
    }
}
