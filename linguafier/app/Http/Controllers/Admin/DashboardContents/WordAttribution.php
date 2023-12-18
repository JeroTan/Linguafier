<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WordAttribution extends Controller
{
    // STRUCT

    // GET
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
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
        return [];
    }
}
