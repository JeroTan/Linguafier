<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\Language;
use App\Models\Rarity;
use App\Models\Variation;
use App\Models\Word;
use HelpMoKo;
use Inertia\Inertia;
use Illuminate\Http\Request;

class Homepage extends Controller
{
    public function __invoke(){

        session()->keep(['getAllMapNodes']);

        $data = Word::inRandomOrder()->first();
        HelpMoKo::updateWordDependency($data->id);
        $data = Word::find($data->id);
        $toUserData = [];
        $language_data = Language::find($data->language_id);
        $toUserData['keyname'] = $data->keyname;
        $toUserData['language'] = $language_data->name;
        $variation_data = [];
        foreach(json_decode($data->variation, true) as $key =>$val){
            $raw = Variation::find($val['id']);
            $variation_data[count($variation_data)] = ['id'=>$raw->id, 'name'=>$raw->name, 'image'=>$raw->image];
        }
        $toUserData['variation'] = $variation_data;
        $toUserData['varname'] = json_decode($data->varname, true);
        $toUserData['definition'] = json_decode($data->definition, true);
        $toUserData['pronounciation'] = json_decode($data->pronounciation, true);
        $toUserData['example'] = json_decode($data->examples, true);
        $rarity_data = Rarity::find($data->rarity_id);
        $toUserData['rarity'] = ['name'=>$rarity_data->name, 'color'=>$rarity_data->color, 'level'=>$rarity_data->level];
        $attribute_data = [];
        foreach(json_decode($data->attributes, true) as $key=> $val){
            $raw = Attribute::find($val['id']);
            $attribute_data[count($attribute_data)] = ['name'=>$raw->name, 'image'=>$raw->image, 'color'=>$raw->color];
        }
        $toUserData['attributes'] = $attribute_data;
        $toUserData['relationyms'] = json_decode($data->relationyms, true);
        $toUserData['hierarchymap'] = json_decode($data->hierarchy_map, true);
        $toUserData['origin']= $data->origin;
        $toUserData['images'] = json_decode($data->images, true);
        $toUserData['sources'] = json_decode($data->sources, true);

        return Inertia::render('Homepage', [
            'pageUser'=>'User',
            'data'=>$toUserData,
        ]);
    }
}
