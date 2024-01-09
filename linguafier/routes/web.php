<?php

use App\Http\Controllers\Admin\Login as AdminLogin;
use App\Http\Controllers\Admin\Dashboard as AdminDashboard;
use App\Http\Controllers\Admin\DashboardContents\OverseerWizard;
use App\Http\Controllers\Admin\DashboardContents\SpecialUser;
use App\Http\Controllers\Admin\DashboardContents\WizardRanks;
use App\Http\Controllers\Admin\DashboardContents\WordAttribution;
use App\Http\Controllers\Admin\DashboardContents\WordLibrary;
use App\Http\Controllers\Admin\DashboardContents\Roles;
use App\Http\Controllers\Dictionary;
use App\Http\Controllers\User\Login as UserLogin;
use App\Http\Controllers\User\Dashboard as UserDashboard;

use App\Http\Controllers\Homepage;
use App\Http\Controllers\Resources\HierarchyMapNodes;
use App\Http\Controllers\Study;
use App\Http\Controllers\Word;
use App\Http\Middleware\CheckId;
use App\Http\Middleware\NotOwnerAllowed;
use App\Http\Middleware\PrivilegeEntry;
use App\Http\Middleware\SpecAccNoSelf;
use App\Http\Middleware\WordExist;
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

Route::get('/', Homepage::class)->name('home');

Route::get('/dictionary', Dictionary::class);
Route::post('/dictionary/change_contents', [Dictionary::class, 'change_contents']);

Route::get('/study', Study::class );

Route::prefix('/word')->group(function(){
    Route::get('/', Word::class);
    Route::get('/{id}', [Word::class, 'word_ui'])->middleware(WordExist::class);
});


Route::post('/getAllMapNodes',  [HierarchyMapNodes::class, 'requestMap']);

Route::prefix('/user')->group(function(){
    Route::get('/login', UserLogin::class)->middleware('UserAccLog:off')->name('user.login');

    Route::get('/dashboard', UserDashboard::class)->middleware('UserAccLog:on')->name('user.dashboard');
});

Route::prefix('/admin')->group(function(){
    Route::get('/', AdminLogin::class)->middleware('SpecAccLog:off')->name('admin');
    Route::get('/login', AdminLogin::class)->middleware('SpecAccLog:off')->name('admin.login');
    Route::post('/logout', [AdminLogin::class, 'Logout'])->middleware('SpecAccLog:on')->name('admin.logout');
    Route::post('/loginVerified', [AdminLogin::class, 'LoginVerified'])->middleware('SpecAccLog:off')->name('admin.login_verified');


    Route::prefix('/dashboard')->middleware('SpecAccLog:on')->group(function(){
        $privEnt = PrivilegeEntry::class.":";

        Route::get('/', AdminDashboard::class)->name('admin.dashboard');

        Route::prefix('/special_user')->middleware($privEnt."Manage Special User")->group(function(){
            $checkId  = CheckId::class.":admin.special_user,specialaccount";
            Route::get('/', SpecialUser::class)->name('admin.special_user');
            Route::post('/changeContents', [SpecialUser::class, "changeContents"]);
            Route::get('/add', [SpecialUser::class, "add_ui"]);
            Route::post('add_roleSearch', [SpecialUser::class, "add_roleSearch"]);
            Route::post('/add_submit', [SpecialUser::class, 'add_submit']);
            Route::get('/modify/{id}', [SpecialUser::class, 'modify_ui'])->middleware($checkId)->middleware(SpecAccNoSelf::class)->middleware(NotOwnerAllowed::class.":true");
            Route::post('/modify_submit/{id}', [SpecialUser::class, 'modify_submit'])->middleware($checkId)->middleware(SpecAccNoSelf::class)->middleware(NotOwnerAllowed::class.":true");
            Route::post('/delete/{id}', [SpecialUser::class, 'delete'])->middleware($checkId)->middleware(SpecAccNoSelf::class)->middleware(NotOwnerAllowed::class.":true");

        });

        Route::prefix('/overseer_wizard')->middleware($privEnt."Manage Wizard")->group(function(){
            Route::get('/', OverseerWizard::class)->name('admin.overseer_wizard');
        });

        Route::prefix('/wizard_ranks')->middleware($privEnt."Manage Wizard Rank")->group(function(){
            Route::get('/', WizardRanks::class)->name('admin.wizard_ranks');
        });

        Route::prefix('/word_library')->middleware($privEnt."Manage Word Library")->group(function(){
            $checkId = CheckId::class.":admin.word_library,word";
            Route::get('/', WordLibrary::class)->name('admin.word_library');
            Route::post('/changeContents', [WordLibrary::class, 'changeContents']);
            Route::get('/add', [WordLibrary::class, 'add_ui']);
            Route::post('/search_data', [WordLibrary::class, 'search_data']);
            Route::post('/add_submit', [WordLibrary::class, 'add_submit']);
            Route::get('/modify/{id}', [WordLibrary::class, 'modify_ui'])->middleware($checkId);
            Route::post('/modify_submit/{id}', [WordLibrary::class, 'modify_submit'])->middleware($checkId);
            Route::post('/delete/{id}', [WordLibrary::class, 'delete'])->middleware($checkId);
        });

        Route::prefix('/word_attribution')->middleware($privEnt."Manage Word Attributes")->group(function(){
            $ctrl = WordAttribution::class;
            $checkId  = CheckId::class.":admin.word_attribution,";
            Route::get('/', $ctrl)->name('admin.word_attribution');
            Route::post('/changeContents', [$ctrl, 'changeContents']);
            Route::get('/add_variation', [$ctrl, 'add_variation_UI']);
            Route::get('/add_attribute', [$ctrl, 'add_attribute_UI']);
            Route::get('/add_rarity', [$ctrl, 'add_rarity_UI']);
            Route::get('/add_language', [$ctrl, 'add_language_UI']);
            Route::post('/add_variation_submit', [$ctrl, 'add_variation_submit']);
            Route::post('/add_attribute_submit', [$ctrl, 'add_attribute_submit']);
            Route::post('/add_rarity_submit', [$ctrl, 'add_rarity_submit']);
            Route::post('/add_language_submit', [$ctrl, 'add_language_submit']);
            Route::get('/modify_variation/{id}', [$ctrl, 'modify_variation_UI'])->middleware($checkId."variation");
            Route::get('/modify_attribute/{id}', [$ctrl, 'modify_attribute_UI'])->middleware($checkId."attribute");
            Route::get('/modify_rarity/{id}', [$ctrl, 'modify_rarity_UI'])->middleware($checkId."rarity");
            Route::get('/modify_language/{id}', [$ctrl, 'modify_language_UI'])->middleware($checkId."language");
            Route::post('/modify_variation_submit/{id}', [$ctrl, 'modify_variation_submit'])->middleware($checkId."variation");
            Route::post('/modify_attribute_submit/{id}', [$ctrl, 'modify_attribute_submit'])->middleware($checkId."attribute");
            Route::post('/modify_rarity_submit/{id}', [$ctrl, 'modify_rarity_submit'])->middleware($checkId."rarity");
            Route::post('/modify_language_submit/{id}', [$ctrl, 'modify_language_submit'])->middleware($checkId."language");
            Route::post('/delete_variation/{id}', [$ctrl, 'delete_variation'])->middleware($checkId."variation");
            Route::post('/delete_attribute/{id}', [$ctrl, 'delete_attribute'])->middleware($checkId."attribute");
            Route::post('/delete_rarity/{id}', [$ctrl, 'delete_rarity'])->middleware($checkId."rarity");
            Route::post('/delete_language/{id}', [$ctrl, 'delete_language'])->middleware($checkId."language");
        });

        Route::prefix('/roles')->middleware($privEnt."Manage Roles")->group(function(){
            $checkId  = CheckId::class.":admin.roles,role";
            Route::get('/', Roles::class)->name('admin.roles');
            Route::post('/changeContents', [Roles::class, 'changeContents'])->name('admin.roles.contents');
            Route::get('/add', [Roles::class, 'addRole_UI'])->name('admin.roles.add');
            Route::post('/create', [Roles::class, 'create'])->name('admin.roles.create');
            Route::get('/modify/{id}', [Roles::class, 'modifyRole_UI'])->name('admin.roles.modify_ui')->middleware($checkId);
            Route::post('/modify_submit/{id}', [Roles::class, 'modify'])->name('admin.roles.modify_submit')->middleware($checkId);
            Route::post('/delete/{id}', [Roles::class, 'delete'])->name('admin.roles.delete')->middleware($checkId);
        });

    });



});
