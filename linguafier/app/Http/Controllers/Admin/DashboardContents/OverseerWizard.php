<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OverseerWizard extends Controller
{
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/OverseerWizard', [
            'popFlash'=>session('popFlash'),
            'pageUser'=>'Special',
            'privilege'=>false,
            'adminPage'=>"Wizard",
        ]);
    }
}
