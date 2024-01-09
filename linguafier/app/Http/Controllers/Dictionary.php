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
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class Dictionary extends Controller
{
    //Struct
    protected function sortKey(){
        return ['word.keyname', 'rarity.name', 'rarity.level', 'word.created_time', 'word.modified_time'];
    }
    protected function filterKey(){
        $variation = [];
        foreach(Variation::all() as $key => $val){
            $variation[$key] = $val->name;
        }
        $raritynames = [];
        foreach(Rarity::all() as $key => $val){
            $raritynames[$key] = $val->name;
        }
        $languagenames = [];
        foreach(Language::all() as $key =>$val){
            $languagenames[$key] = $val->name;
        }
        $attributes = [];
        foreach(Attribute::all() as $key => $val){
            $attributes[$key] = $val->name;
        }
        return [
            ['word.variation', "checklist", $variation, "wildcard"],
            ['rarity.level', "range", [0, 100]],
            ['rarity.name', "checklist", $raritynames],
            ['word.attributes', "checklist", $attributes , "wildcard"],
            ['language.name', "checklist", $languagenames],
            ['word.modified_time', "range_date",],
            ['word.created_time', "range_date",],
        ];
    }

    //GET
    public function __invoke(){
        return Inertia::render('Dictionary', [
            'pageUser'=>'User',
            'data'=>$this->get_contents(),
            'variationData'=>Variation::orderBy('name', "ASC")->get(),
            'attributeData'=>Attribute::orderBy('name', "ASC")->get(),
            'rarityData'=>Rarity::orderBy('name', "ASC")->get(),
            'languageData'=>Language::orderBy('name', "ASC")->get(),
        ]);
    }

    //POST
    public function change_contents(Request $request){
        //Verify Data
        //Search
        $request->validate([
            'v_search' => 'nullable|max:256',
            'v_sort' => 'required',
        ], [
            'v_search.max'=>'Search Limit Reached My Friend.'
        ]);
        //Filter | Range | Checklist | Radio | Text - This will streamline the validation of Filter
        $toFilter = [];
        $filterRule = [
            'v_filter'=>'required|array|size:'.count($this->filterKey()),
            'v_filter.*'=>'required|array|size:4|required_array_keys:Name,Ref,Type,Data',
            'v_filter.*.Name'=>'string',
            'v_filter.*.Ref'=>[
                'required',
                'string',
                Rule::in( array_map(function($val){
                    return $val[0];
                }, $this->filterKey()) ),
            ],
            'v_filter.*.Type'=>[
                'required',
                'string',
                'in:radio,checklist,range,range_date',
            ],
        ];
        $request->validate($filterRule);
        foreach($this->filterKey() as $key => $val){
            $Data = $request->v_filter[$key]['Data'];
            $toFilter[$key] = [$val[0], $val[1], []];
            if(isset($val[3]))//check if the key has 4 value for other options
                $toFilter[$key][3] = $val[3];

            if($val[1] == "radio"){
                $toFilter[$key][2] = $Data["Selected"];

            }elseif($val[1] == "checklist"){
                foreach($val[2] as $key2 => $val2){
                    if($Data[$key2]["Value"] == true){
                        array_push($toFilter[$key][2], $val2);
                    }
                }

            }elseif($val[1] == "range"){
                if(!$Data['Min'] || $Data['Min'] <= 0){
                    $Data['Min'] =  $val[2][0] ? $val[2][0] : "0";
                }
                if(!$Data['Max'] || $Data['Max'] <= 0){
                    $Data['Max'] = $val[2][1] ? $val[2][1] : "999999999999999";
                }

                $rangeValidation = Validator::make(
                    [ 'Min'=>$Data["Min"],
                        'Max'=>$Data["Max"] ],
                    [ 'Min'=>"required|numeric|between:".$val[2][0].",".$val[2][1],
                        'Max'=>"required|numeric|between:".$val[2][0].",".$val[2][1],  ],
                );
                if($rangeValidation->fails()){
                    $Data['Min'] = $val[2][0];
                    $Data['Max'] = $val[2][1];
                }
                $toFilter[$key][2] = ["Min"=>$Data['Min'], "Max"=>$Data['Max'] ];
            }elseif($val[1] == "range_date"){
                if(!$Data['Min']){
                    $Data['Min']="0001-01-01T12:00";
                }
                if(!$Data['Max']){
                    $Data['Max']="9999-12-31T12:59";
                }
                $rangeValidation = Validator::make(
                    [ 'Min'=>$Data["Min"],
                        'Max'=>$Data["Max"], ],
                    [ 'Min'=>"required|date|before_or_equal:".$Data['Max'],
                        'Max'=>"required|date|after_or_equal:".$Data['Min'], ]  );
                if($rangeValidation->fails()){
                    //return redirect()->back()->withErrors($rangeValidation);
                    $Data['Min']="0001-01-01T12:00";
                    $Data['Max']="9999-12-31T12:59";
                }
                $toFilter[$key][2] = ["Min"=>$Data['Min'], "Max"=>$Data['Max'] ];
            }
        }


        //Sort - Check if the key is correct and the value should be ASC or DESC
        $sortRule =[
            'v_sort'=>'required|array|size:'.count($this->sortKey()),
            'v_sort.*'=>'required|array|size:3|required_array_keys:Name,Ref,Sort',
            'v_sort.*.Name'=>[
                'required',
                'string',
            ],
            'v_sort.*.Ref'=>[
                'required',
                'string',
                Rule::in($this->sortKey()),
            ],
            'v_sort.*.Sort'=>[
                'required',
                'string',
                Rule::in(['ASC', 'DESC']),
            ],
        ];
        $request->validate($sortRule);

        return redirect()->back()->with(['v_search'=>$request->v_search, 'v_sort'=>$request->v_sort, 'v_filter'=>$toFilter]);
    }

    //Functionality
    protected function get_contents(){
        //Start Fetch
        $data = Word::select('word.*', 'rarity.name as rarity_name', 'rarity.level as rarity_level', 'rarity.color as rarity_color', 'language.name as language_name')->leftjoin('rarity', 'word.rarity_id', '=', 'rarity.id')->leftjoin('language','word.language_id', '=', 'language.id');

        //Search
        if(session('v_search') ){
            $data = $data->where( function($query){
                $query->orWhereRaw("LOWER(word.keyname) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'");
            });
        };

        if(session('v_filter') ){

            foreach(session('v_filter') as $key=>$val){
                switch($val[1]){
                    case 'radio':
                        if(empty($val[2]))
                            break;
                        $data = $data->where($val[0], $val[2]);
                    break;
                    case 'checklist':
                        if(empty($val[2]))
                            break;

                        if(isset($val[3])){
                            if($val[3] == 'wildcard'){
                                $data = $data->where( function($q) use ($val){
                                    foreach($val[2] as $key2=>$val2){
                                        $q = $q->orWhere($val[0], 'LIKE', '%' . $val2 . '%');
                                    }
                                });
                            }
                        }else
                        $data = $data->whereIn($val[0], $val[2]);
                    break;
                    case 'range': case 'range_date':
                        $data = $data->whereBetween( $val[0], [ $val[2]['Min'], $val[2]['Max']  ] );
                    break;
                    default:
                }
            }
        }

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
        $data = $data->paginate(50)->onEachSide(2);

        // Add Ons and Update
        foreach($data->items() as $key => $val){
            HelpMoKo::updateWordDependency($val->id);
            //Insert Variation Image
            $getVariation = json_decode($val->variation, true);
            if( count($getVariation) ){
                foreach($getVariation as $key2 => $val2){
                    $variationOrig = Variation::find($val2['id']);
                    $getVariation[$key2]['image'] = $variationOrig->image;
                }
            }
            $data->items()[$key]->variation = json_encode($getVariation);
            //Insert Attribute Color and Image
            $getAttribute = json_decode($val->attributes, true);
            if( count($getAttribute) ){
                foreach($getAttribute as $key2 => $val2){
                    $attributeOrig = Attribute::find($val2['id']);
                    $getAttribute[$key2]['image'] = $attributeOrig->image;
                    $getAttribute[$key2]['color'] = $attributeOrig->color;
                }
            }
            $data->items()[$key]->attributes = json_encode($getAttribute);
        }

        return $data;
    }
}
