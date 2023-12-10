<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WizardRanks extends Controller
{
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/WizardRanks', [
            'popFlash'=>session('popFlash'),
            'pageUser'=>'Special',
            'adminPage'=>"Rank",
        ]);
    }
}
