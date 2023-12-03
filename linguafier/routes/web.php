<?php

use App\Http\Controllers\Admin\Login as AdminLogin;
use App\Http\Controllers\Admin\Dashboard as AdminDashboard;

use App\Http\Controllers\User\Login as UserLogin;
use App\Http\Controllers\User\Dashboard as UserDashboard;

use App\Http\Controllers\Homepage;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', Homepage::class);


Route::prefix('/user')->group(function(){
    Route::get('/login', UserLogin::class)->middleware('UserAccLog:off')->name('user.login');

    Route::get('/dashboard', UserDashboard::class)->middleware('UserAccLog:on')->name('user.dashboard');
});

Route::prefix('/admin')->group(function(){
    Route::get('/login', AdminLogin::class)->middleware('SpecAccLog:off')->name('admin.login');
    Route::post('/loginVerified', [AdminLogin::class, 'LoginVerified'])->middleware('SpecAccLog:off')->name('admin.login_verified');
    Route::get('/dashboard', AdminDashboard::class)->middleware('SpecAccLog:on')->name('admin.dashboard');

});
