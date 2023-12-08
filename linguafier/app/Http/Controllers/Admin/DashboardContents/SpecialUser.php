<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SpecialUser extends Controller
{
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/SpecialUser', [
            'popFlash'=>session('popFlash'),
            'pageUser'=>'Special',
            'privilege'=>false,
            'adminPage'=>"User",
        ]);
    }
}
