<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class Study extends Controller
{
    public function __invoke(){
        return Inertia::render('Study', [
            'pageUser'=>'User',
        ]);
    }
}
