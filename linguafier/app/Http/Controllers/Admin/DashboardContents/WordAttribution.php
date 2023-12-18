<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Language;
use App\Models\Rarity;
use App\Models\Variation;
use HelpMoKo;
use Illuminate\Http\Request;

class WordAttribution extends Controller
{
    // STRUCT
    protected function sortKey(){
        return match( session("v_pageSwitch") ){
            "Rarity"=>['name', 'level'],
            default=>['name'],
        };
    }

    // GET
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
            'data'=> $this->getContents(),
        ]);
    }
    public function changeContent(Request $request){

    }
    public function add_variation_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution/AddVariation', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
        ]);
    }
    public function add_attribute_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution/AddAttribute', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
        ]);
    }
    public function add_rarity_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution/AddRarity', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
        ]);
    }
    public function add_language_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution/AddLanguage', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
        ]);
    }
    public function modify_variation_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution/ModifyVariation', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
        ]);
    }
    public function modify_attribute_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution/ModifyAttribute', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
        ]);
    }
    public function modify_rarity_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution/ModifyRarity', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
        ]);
    }
    public function modify_language_UI(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution/ModifyLanguage', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
        ]);
    }

    // POST
    public function add_variation_submit(Request $request){

    }
    public function add_attribute_submit(Request $request){

    }
    public function add_rarity_submit(Request $request){

    }
    public function add_language_submit(Request $request){

    }
    public function modify_variation_submit(Request $request){

    }
    public function modify_attribute_submit(Request $request){

    }
    public function modify_rarity_submit(Request $request){

    }
    public function modify_language_submit(Request $request){

    }
    public function delete_variation(Request $request){

    }
    public function delete_attribute(Request $request){

    }
    public function delete_rarity(Request $request){

    }
    public function delete_language(Request $request){

    }

    // Functionality
    protected function getContents(){
        //Start Fetch
        $data = null;

        //Select Base On What is Looking For
        $data = match( session('v_pageSwitch') ){
            'Variation'=>Variation::select(),
            'Attribute'=>Attribute::select(),
            'Rarity'=>Rarity::select(),
            'Language'=>Language::select(),
            default=>Variation::select(),
        };


        //Required Condition

        //Search
        if(session('v_search') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(name) LIKE '%". HelpMoKo::clense(session('v_search')) ."%'");
                if( session('v_pageSwitch') == "Rarity")
                    $query->orwhereRaw("LOWER(level) LIKE '%". HelpMoKo::clense(session('v_search')) ."%'");
            });
        }

        //Filters

        //Sort
        if(session('v_sort')){
            foreach(session('v_sort') as $key => $val){
                $data = $data->orderBy($val['Ref'], $val['Sort']);
            }
        }else{
            foreach($this->sortKey() as $key => $val){
                $data = $data->orderBy($val, 'ASC');
            }
        }
        // GET
        $data = $data->paginate(15)->onEachSide(2);

        return $data;
    }
}
