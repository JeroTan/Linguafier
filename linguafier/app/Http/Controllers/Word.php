<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class Word extends Controller
{
    public function __invoke(){
        return Inertia::render('Word', [
            'pageUser'=>'User',
        ]);
    }
}
