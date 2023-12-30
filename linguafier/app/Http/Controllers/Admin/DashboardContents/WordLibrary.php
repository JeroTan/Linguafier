<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Language;
use App\Models\Rarity;
use App\Models\Variation;
use App\Models\Word;
use Exception;
use HelpMoKo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use PHPUnit\Event\Code\Throwable;
use Intervention\Image\ImageManager as Image;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;

class WordLibrary extends Controller
{
    //STRUCT
    protected function sortKey(){
        return ['word.keyname', 'rarity_name', 'rarity_level', 'word.created_time', 'word.modified_time'];
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

    // GET
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/WordLibrary', [
            'pageUser'=>'Special',
            'adminPage'=>"Word",
            'data'=>$this->getContents(),
            'variationData'=>Variation::orderBy('name', "ASC")->get(),
            'attributeData'=>Attribute::orderBy('name', "ASC")->get(),
            'rarityData'=>Rarity::orderBy('name', "ASC")->get(),
            'languageData'=>Language::orderBy('name', "ASC")->get(),
        ]);
    }
    public function add_ui(Request $request){
        return Inertia::render('Admin/DashboardContents/WordLibrary/Add', [
            'pageUser'=>'Special',
            'adminPage'=>"Word",
            'variationDrop'=>$this->getVariation(),
            'attributeDrop'=>$this->getAttribute(),
            'rarityDrop'=>$this->getRarity(),
            'languageDrop'=>$this->getLanguage(),
            'synonymsDrop'=>$this->getSynonyms(),
            'antonymsDrop'=>$this->getAntonyms(),
            'homonymsDrop'=>$this->getHomonyms(),
            'tailDrop'=>$this->getTail(),
            'sideDrop'=>$this->getSide(),
            'headDrop'=>$this->getHead(),
        ]);
    }
    public function modify_ui(Request $request, $id){
        return Inertia::render('Admin/DashboardContents/WordLibrary/Modify', [
            'pageUser'=>'Special',
            'adminPage'=>"Word",
            'data'=>Word::find($id),
            'variationDrop'=>$this->getVariation(),
            'attributeDrop'=>$this->getAttribute(),
            'rarityDrop'=>$this->getRarity(),
            'languageDrop'=>$this->getLanguage(),
            'synonymsDrop'=>$this->getSynonyms(),
            'antonymsDrop'=>$this->getAntonyms(),
            'homonymsDrop'=>$this->getHomonyms(),
            'tailDrop'=>$this->getTail(),
            'sideDrop'=>$this->getSide(),
            'headDrop'=>$this->getHead(),
        ]);
    }

    //POST
    public function changeContents(Request $request){
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
        try{
            foreach($this->filterKey() as $key => $val){
                $Data = $request->v_filter[$key]['Data'];
                $toFilter[$key] = [$val[0], $val[1], []];
                if(isset($val[3]))
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
                    if(!$Data['Min']){
                        $Data['Min']="0";
                    }
                    if(!$Data['Max']){
                        $Data['Max']="999999999999999";
                    }
                    $rangeValidation = Validator::make(
                        [ 'Min'=>$Data["Min"],
                            'Max'=>$Data["Max"] ],
                        [ 'Min'=>"required|numeric|between:".$val[2][0].",".$val[2][1]."|lte:".$Data["Max"],
                            'Max'=>"required|numeric|between:".$val[2][0].",".$val[2][1]."|gte:".$Data["Min"],  ],
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
        }catch(Throwable $e){
            return redirect()->back()->withErrors($e);
        }


        //Sort - Check if the key is correct and the value should be ASC or DESC
        $sortVerify = [];
        $sortRule = [];
        try{
            foreach($request->v_sort as $key => $val){
                if( !in_array($val['Ref'], $this->sortKey()) )
                    throw new Exception("Tampered JSON");
                $sortVerify[$val['Ref']] = $val['Sort'];
                $sortRule[$val['Ref']] = 'required|in:ASC,DESC';
            }
        }catch(Throwable $e){
            return redirect()->back()->withErrors($e);
        }
        $sortValidate = Validator::make($sortVerify, $sortRule );
        if($sortValidate->fails()){
            return redirect()->back()->withErrors($sortValidate);
        }

        return redirect()->back()->with(['v_search'=>$request->v_search, 'v_sort'=>$request->v_sort, 'v_filter'=>$toFilter]);
    }
    public function search_data(Request $request){
        //Check for Variation
        if(!$request->has('v_searchVariation') || !$request->filled('v_searchVariation'))
            goto Next1;
        $request->validate([
            'v_searchVariation' => 'nullable|max:256',
        ], [
            'v_searchVariation.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchVariation", $request->v_searchVariation);

        Next1:
        //CHeck for Attribute
        if(!$request->has('v_searchAttribute') || !$request->filled('v_searchAttribute'))
            goto Next2;
        $request->validate([
            'v_searchAttribute' => 'nullable|max:256',
        ], [
            'v_searchAttribute.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchAttribute", $request->v_searchAttribute);

        Next2:
        //Check for Rarity
        if(!$request->has('v_searchRarity') || !$request->filled('v_searchRarity'))
            goto Next3;
        $request->validate([
            'v_searchRarity' => 'nullable|max:256',
        ], [
            'v_searchRarity.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchRarity", $request->v_searchRarity);

        Next3:
        //Check for Language
        if(!$request->has('v_searchLanguage') || !$request->filled('v_searchLanguage'))
            goto Next4;
        $request->validate([
            'v_searchLanguage' => 'nullable|max:256',
        ], [
            'v_searchLanguage.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchLanguage", $request->v_searchLanguage);

        Next4:
        //Check for Synonyms
        if(!$request->has('v_searchSynonyms') || !$request->filled('v_searchSynonyms'))
            goto Next5;
        $request->validate([
            'v_searchSynonyms' => 'nullable|max:256',
        ], [
            'v_searchSynonyms.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchSynonyms", $request->v_searchSynonyms);

        Next5:
        //Check for Antonyms
        if(!$request->has('v_searchAntonyms') || !$request->filled('v_searchAntonyms'))
            goto Next6;
        $request->validate([
            'v_searchAntonyms' => 'nullable|max:256',
        ], [
            'v_searchAntonyms.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchAntonyms", $request->v_searchAntonyms);

        Next6:
        //Check for Homonyms
        if(!$request->has('v_searchHomonyms') || !$request->filled('v_searchHomonyms'))
            goto Next7;
        $request->validate([
            'v_searchHomonyms' => 'nullable|max:256',
        ], [
            'v_searchHomonyms.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchHomonyms", $request->v_searchHomonyms);

        Next7:
        //Check for Tail
        if(!$request->has('v_searchTail') || !$request->filled('v_searchTail'))
            goto Next8;
        $request->validate([
            'v_searchTail' => 'nullable|max:256',
        ], [
            'v_searchTail.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchTail", $request->v_searchTail);

        Next8:
        //Check for Side
        if(!$request->has('v_searchSide') || !$request->filled('v_searchSide'))
            goto Next9;
        $request->validate([
            'v_searchSide' => 'nullable|max:256',
        ], [
            'v_searchSide.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchSide", $request->v_searchSide);

        Next9:
        //Check for Head
        if(!$request->has('v_searchHead') || !$request->filled('v_searchHead'))
            goto Next10;
        $request->validate([
            'v_searchHead' => 'nullable|max:256',
        ], [
            'v_searchHead.max'=>'Search Limit Reached My Friend.'
        ]);
        return redirect()->back()->with("v_searchHead", $request->v_searchHead);

        Next10:

    }
    public function add_submit(Request $request){
        $this->quickValidate($request);
    }
    public function modify_submit(Request $request, $id){

    }
    public function delete(Request $request, $id){

    }



    //FUNCTIONALITY
    protected function getContents(){
        //Start Fetch
        $data = Word::select('word.*', 'rarity.name as rarity_name', 'rarity.level as rarity_level', 'rarity.color as rarity_color', 'language.name as language_name')->leftjoin('rarity', 'word.rarity_id', '=', 'rarity.id')->leftjoin('language','word.language_id', '=', 'language.id');

        //Required Condition


        //Search
        if(session('v_search') ){
            $data = $data->where( function($query){
                $query = $query->orWhereRaw("LOWER(word.keyname) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'")
                    // ->orWhereRaw("LOWER(rarity.name) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'")
                    ->orWhereRaw("LOWER(rarity.level) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'")
                    // ->orWhereRaw("LOWER(language.name) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'")
                    ;
                //Get the Variation First
                $Variation = Variation::all();
                for($i = 0; $i < count($Variation); $i++){//Then Check each of those here
                    $ref = $Variation->id;
                    $query = $query->orWhereRaw("LOWER(JSON_VALUE(definition, `$.$ref.name`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                        ->orWhereRaw("LOWER(JSON_VALUE(word.definition, `$.$ref.definition`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                        ->orWhereRaw("LOWER(JSON_VALUE(word.variation, `$.$ref`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                        ->orWhereRaw("LOWER(JSON_VALUE(word.pronounciation, `$.$ref.simple`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                        ->orWhereRaw("LOWER(JSON_VALUE(word.pronounciation, `$.$ref.original`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.synonyms`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.antonyms`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.homonyms`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(examples, `$.$ref`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(examples, `$.$ref`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        ;
                }
                //
            });
        };

        //Filters
        /*
            - Variation - checklist noun, pronoun, verb ..,
            - Rarity->Level - Range
            - Rarity->Name - checklist
            - Created_Time - RangeDate Exclussive here in admin
            - Modified_Time - RangeDate Exclussive here in admin
            - Language - checklist
            - Attributes - SelectionDrop
        */
        if(session('v_filter') ){
            foreach(session('v_filter') as $key=>$val){
                switch($val[1]){
                    case 'radio':
                            $data = $data->where($val[0], $val[2]);
                    break;
                    case 'checklist':
                        if(isset($val[3])){
                            if($val[3] == 'wildcard'){
                                $data->where( function($q) use ($val){
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
        $data = $data->paginate(15)->onEachSide(2);

        return $data;
    }
    protected function getVariation(){
        $data = Variation::select('id','name');
        //Requirement

        //Search
        if( session('v_searchVariation') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(name) LIKE '%". HelpMoKo::cleanse(session('v_searchVariation'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getAttribute(){
        $data = Attribute::select('id','name');
        //Requirement

        //Search
        if( session('v_searchAttribute') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(name) LIKE '%". HelpMoKo::cleanse(session('v_searchAttribute'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getRarity(){
        $data = Rarity::select('id','name');
        //Requirement

        //Search
        if( session('v_searchRarity') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(name) LIKE '%". HelpMoKo::cleanse(session('v_searchRarity'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getLanguage(){
        $data = Language::select('id','name');
        //Requirement

        //Search
        if( session('v_searchLanguage') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(name) LIKE '%". HelpMoKo::cleanse(session('v_searchLanguage'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getSynonyms(){
        $data = Word::select('id', 'keyname as name');
        //Requirement

        //Search
        if( session('v_searchSynonyms') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchSynonyms'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getAntonyms(){
        $data = Word::select('id', 'keyname as name');
        //Requirement

        //Search
        if( session('v_searchAntonyms') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchAntonyms'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getHomonyms(){
        $data = Word::select('id', 'keyname as name');
        //Requirement

        //Search
        if( session('v_searchHomonyms') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchHomonyms'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getTail(){
        $data = Word::select('id', 'keyname as name');
        //Requirement

        //Search
        if( session('v_searchTail') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchTail'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getSide(){
        $data = Word::select('id', 'keyname as name');
        //Requirement

        //Search
        if( session('v_searchSide') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchSide'))."%'");
            });
        }
        return $data->limit(15)->get();
    }
    protected function getHead(){
        $data = Word::select('id', 'keyname as name');
        //Requirement

        //Search
        if( session('v_searchHead') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchHead'))."%'");
            });
        }
        return $data->limit(15)->get();
    }


    protected function quickValidate($request, $type = "Add"){
        /**
         * Rules Included:
         * - Keyname
         * - Language
         * - Variation
         * - Defintion(validatorOnly)
         * - Pronounciation(validatorOnly)
         * - Examples(validatorOnly)
         * - Rarity
         * - Attributes
         * - Relationyns
         * - Heirarchy Map
         * - Origin
         * - Image
         * - Sources
         */
        dd($request->all());
        $variationIds = implode(",", array_map(function($n){
            return $n['id'];
        }, $request->v_variation  ));


        $rules = [
            'v_keyname'=>[
                'required',
                'regex:/^[a-zA-Z0-9\,\.\s]*$/',
                'max:64',
            ],
            'v_language'=>'required|array|required_array_keys:id,name',
            'v_language.id'=>'required|exists:language,id',
            'v_language.name'=>'required|exists:language,name',

            'v_variation'=>'required|array|min:1',
            'v_variation.*'=>'required|array|required_array_keys:id,name',
            'v_variation.*.id'=>'required|exists:variation,id',
            'v_variation.*.name'=>'required|exists:variation,name',

            'v_definition'=>"required|array|required_array_keys:$variationIds",
            'v_definition.*'=>"required|string|not_regex:/<script\b[^>]*>[\s\S]*?<\/script\s*>/",

            'v_pronounciation'=>"required|array|required_array_keys:$variationIds",
            'v_pronounciation.*'=>"required|array|required_array_keys:simple,original",
            'v_pronounciation.*.simple'=>"nullable|string",
            'v_pronounciation.*.original'=>"nullable|string",

            'v_example'=>"required|array|required_array_keys:$variationIds",
            'v_example.*'=>"nullable|array|max:10",
            'v_example.*.*'=>"required|string",

            'v_rarity'=>"required|array|required_array_keys:id,name",
            'v_rarity.id'=>"required|exists:rarity,id",
            'v_rarity.name'=>"required|exists:rarity,name",

            'v_attributes'=>"required|array|min:1",
            'v_attributes.*'=>"required|array|required_array_keys:id,name",
            'v_attributes.*.id'=>"required|exists:attribute,id",
            'v_attributes.*.name'=>"required|exists:attribute,name",

            'v_relationyms'=>"required|array|required_array_keys:synonyms,antonyms,homonyms",
            'v_relationyms.*'=>"nullable|array",
            'v_relationyms.*.*'=>"array|required_array_keys:id,name",
            'v_relationyms.*.*.id'=>"required|exists:word,id",
            'v_relationyms.*.*.name'=>"required|exists:word,keyname",

            'v_heirarchymap'=>"required|array|required_array_keys:head,side,tail",
            'v_heirarchymap.*'=>"nullable|array",
            'v_heirarchymap.*.*'=>"required|array|required_array_keys:id,name",
            'v_heirarchymap.*.*.id'=>"required|exists:word,id",
            'v_heirarchymap.*.*.name'=>"required|exists:word,keyname",

            'v_origin'=>"nullable|string|not_regex:/<script\b[^>]*>[\s\S]*?<\/script\s*>/",

            'v_images'=>"required|array|max:3",
            'v_images.*'=>[],

            'v_sources'=>"nullable|array|max:100",
            'v_sources.*'=>"required|string",
        ];
        $messages = [
            'v_keyname.required'=>"Keyname is required.",
            'v_keyname.regex'=>"Keyname must contain only letters and number.",
            'v_keyname.max'=>"Keyname character limit reached. The maximum is 64 characters.",

            'v_language.*.required'=>"Language is required.",
            'v_language.*.exists'=>"Invalid input data detected.",

            'v_variation.required'=>'Variation is required.',
            'v_variation.array'=>'Invalid input data detected.',
            'v_variation.min'=>'Variation is required.',

            'v_definition.*.required'=>"Definition is required.",
            'v_definition.*.string'=>"Invalid input data detected.",
            'v_definition.*.not_regex'=>"Invalid input data detected.",

            'v_pronounciation.*.*.string'=>"Invalid input data detected.",

            'v_example.*.*.required'=>"Example should not be empty.",
            'v_example.*.*.string'=>"Invalid input data detected.",

            'v_rarity.*.required'=>"Rarity is required.",
            'v_rarity.*.exists'=>"Invalid input data detected.",

            'v_attributes.required'=>"Attribute is required.",
            'v_attributes.array'=>"Invalid input data detected.",
            'v_attributes.min'=>"Attribute is required.",

            'v_relationyms.*.array'=>"Invalid input data detected.",

            'v_heirarchymap.*.array'=>"Invalid input data detected.",

            'v_origin.string'=>"Invalid input data detected.",
            'v_origin.not_regex'=>"Invalid input data detected.",

            //Images if ever,

            'v_soruces.*.required'=>"Input is required.",
            'v_sources.*.string'=>"Invalid input data detected.",
        ];

        //Insert Additional
        if($type == 'Add'){
            $rules['v_images.*'] = [
                "nullable",
                "file",
                "mimes:jpeg,jpg,png,gif,bimp,tiff,webp,svg",
                "max:8192"
            ];
            $messages['v_images.*.file'] = "Image is not a valid file.";
            $messages['v_images.*.mimes'] = "Image is not a valid file.";
            $messages['v_images.*.max'] = "File is too large, please upload less than 8mb only.";
        };

        $request->validate($rules, $messages);
        //dd($rules, $messages);
    }
    protected function successReturn($name, $type = "create"){
        $flashData = [
            'Type'=>'success',
            'Title'=>match($type){
                "create"=>'Created Successfully',
                "modify"=>'Modified Succesfully',
                "delete"=>'Removed Successfully'
            },
            'Message'=>match($type){
                "create"=>"A new word \"".$name."\" was added to the magic system.",
                "modify"=>"The word \"".$name."\" was modified in the magic system.",
                "delete"=>"The word \"".$name."\" was removed from the magic system.",
            },
        ];
        return redirect()->back()->with( 'popFlash', $flashData);
    }
    protected function uploadReturnFile($image, $path, $name, $type="jpeg", $size = [2048, 2048]){
        $name = $name."_".HelpMoKo::generateID('OnlyMeChanics');
        $image = $this->refineImage($image, $size);
        $this->deleteImage($path, $name);
        Storage::disk('public')->put( ($path.$name.".".$type), $image );
        return $name.".".$type;
    }
    protected function deleteImage($path, $name, $types=["jpeg","jpg","png","gif","bimp","tiff","webp","svg"]){
        foreach($types as $key => $val){
            if( Storage::disk('public')->exists( $path.$name.".".$val ) ){
                Storage::disk('public')->delete( $path.$name.".".$val );
            }
        };
    }
    protected function refineImage($image, $size = [2048, 2048]){
        $Image = new Image(new ImagickDriver());
        $Image = $Image->read(($image));
        $Image = $Image->scale($size[0], $size[1]);
        $Image = $Image->toPng();
        return $Image;
    }
}
