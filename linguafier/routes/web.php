<?php

use App\Http\Controllers\Admin\Login as AdminLogin;
use App\Http\Controllers\Admin\Dashboard as AdminDashboard;
use App\Http\Controllers\Admin\DashboardContents\OverseerWizard;
use App\Http\Controllers\Admin\DashboardContents\SpecialUser;
use App\Http\Controllers\Admin\DashboardContents\WizardRanks;
use App\Http\Controllers\Admin\DashboardContents\WordAttribution;
use App\Http\Controllers\Admin\DashboardContents\WordLibrary;
use App\Http\Controllers\Admin\DashboardContents\Roles;
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
    Route::get('/', AdminLogin::class)->middleware('SpecAccLog:off')->name('admin');
    Route::get('/login', AdminLogin::class)->middleware('SpecAccLog:off')->name('admin.login');
    Route::post('/logout', [AdminLogin::class, 'Logout'])->middleware('SpecAccLog:on')->name('admin.logout');
    Route::post('/loginVerified', [AdminLogin::class, 'LoginVerified'])->middleware('SpecAccLog:off')->name('admin.login_verified');


    Route::prefix('/dashboard')->group(function(){
        Route::get('/', AdminDashboard::class)->name('admin.dashboard');

        Route::get('/special_user', SpecialUser::class)->name('admin.special_user');

        Route::get('/overseer_wizard',OverseerWizard::class )->name('admin.overseer_wizard');

        Route::get('/word_library', WordLibrary::class)->name('admin.word_library');

        Route::get('/word_attribution', WordAttribution::class)->name('admin.word_attribution');

        Route::get('/wizard_ranks', WizardRanks::class)->name('admin.wizard_ranks');


        Route::prefix('/roles')->group(function(){
            Route::get('/', Roles::class)->name('admin.roles');
            Route::post('/changeContents', [Roles::class, 'changeContents'])->name('admin.roles.contents');
            Route::get('/add', [Roles::class, 'addRole'])->name('admin.roles.add');
        });

    })->middleware('SpecAccLog:on');



});
