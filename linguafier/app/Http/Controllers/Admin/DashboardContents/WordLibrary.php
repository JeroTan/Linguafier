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
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Testing\Exceptions\InvalidArgumentException;
use Illuminate\Validation\Rule;
use PHPUnit\Event\Code\Throwable;
use Intervention\Image\ImageManager as Image;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;

class WordLibrary extends Controller
{
    //STRUCT
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

        //Manip data Before sending to the
        $this->updateWordDependency($id);
        $data = Word::find($id);
        $language_data = Language::find($data->language_id);
        $data->language = ['name'=>$language_data->name, 'id'=>$data->language_id];
        $data->variation = json_decode($data->variation, true);
        $data->varname = json_decode($data->varname, true);
        $data->definition = json_decode($data->definition, true);
        $data->pronounciation = json_decode($data->pronounciation, true);
        $data->example = json_decode($data->examples, true);
        $rarity_data = Rarity::find($data->rarity_id);
        $data->rarity = ['name'=>$rarity_data->name, 'id'=>$data->rarity_id];
        $data->attributes = json_decode($data->attributes, true);
        $data->relationyms = json_decode($data->relationyms, true);
        $data->hierarchymap = json_decode($data->hierarchy_map, true);
        $data->images = json_decode($data->images, true);
        $data->previmages = array_map(function($val){
            return asset('storage/word_library/'.$val);
        }, $data->images);
        $data->sources = json_decode($data->sources, true);
        if(count($data->images)){
            $data->images = array_map(function($val){
                return [
                    'name'=>$val
                ];
            }, $data->images);
        }else{
            $data->images = [""];
            $data->previmages = [""];
        }
        if(count($data->images) < 3){
            $thisGame = $data->images;
            $thisGame[count($thisGame)] = "";
            $data->images = $thisGame;

        }

        return Inertia::render('Admin/DashboardContents/WordLibrary/Modify', [
            'pageUser'=>'Special',
            'adminPage'=>"Word",
            'data'=>$data,
            'variationDrop'=>$this->getVariation(),
            'attributeDrop'=>$this->getAttribute(),
            'rarityDrop'=>$this->getRarity(),
            'languageDrop'=>$this->getLanguage(),
            'synonymsDrop'=>$this->getSynonyms($id),
            'antonymsDrop'=>$this->getAntonyms($id),
            'homonymsDrop'=>$this->getHomonyms($id),
            'tailDrop'=>$this->getTail($id),
            'sideDrop'=>$this->getSide($id),
            'headDrop'=>$this->getHead($id),
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
        // Validate and get the Remake Data
        $remake = $this->quickValidate($request);


        //Proceed to Store and Create Data
        $newWord = new Word;
        $newWord->id = HelpMoKo::generateID('OnlyMeChanics', 10);
        $newWord->keyname = $remake['v_keyname'];
        $newWord->varname = $remake['v_varname'];
        $newWord->language_id = $remake['v_language']['id'];
        $newWord->variation = $remake['v_variation'];
        $newWord->definition = $remake['v_definition'];
        $newWord->pronounciation = $remake['v_pronounciation'];
        $newWord->examples = $remake['v_example'];
        $newWord->rarity_id = $remake['v_rarity']['id'];
        $newWord->attributes = $remake['v_attributes'];

        $newWord->relationyms = $remake['v_relationyms'];
        $newWord->hierarchy_map = $remake['v_hierarchymap'];

        $newWord->origin = $remake['v_origin'];
        $imagesCollecter = [];
        foreach($remake['v_images']  as $key => $val ){//Images
            if($val)
                $imagesCollecter[count($imagesCollecter)] = $this->uploadReturnImage($val, "word_library/" , $newWord->id);
        }
        $newWord->images = json_encode($imagesCollecter);
        $newWord->sources = $remake['v_sources'];
        $newWord->modified_time = now();
        $newWord->save();

        //Update Word Dependencies here
        $this->updateWordDependency($newWord->id);

        //Return Succes
        $this->successReturn($newWord->keyname, "add");

    }
    public function modify_submit(Request $request, $id){
        // Validate
        $remake = $this->quickValidate($request, 'Modify');

        //Proceed to Store and Create Data
        $word = Word::find($id);
        $word->keyname = $remake['v_keyname'];
        $word->language_id = $remake['v_language']['id'];
        $word->varname = $remake['v_varname'];
        $word->variation = $remake['v_variation'];
        $word->definition = $remake['v_definition'];
        $word->pronounciation = $remake['v_pronounciation'];
        $word->examples = $remake['v_example'];
        $word->rarity_id = $remake['v_rarity']['id'];
        $word->attributes = $remake['v_attributes'];
        $word->relationyms = $remake['v_relationyms'];
        $word->hierarchy_map = $remake['v_hierarchymap'];
        $word->origin = $remake['v_origin'];
        $imagesCollecter = [];
        foreach($remake['v_images']  as $key => $val ){//Images
            if($val[0] === 'delete'){
                foreach( json_decode($word->images, true) as $key2 => $val2){
                    if($key2 >= $key){
                        $this->deleteImage('word_library/', trim($val2, ".jpeg"));
                    }
                }
            }elseif($val[0] === 'retain'){
                $imagesCollecter[count($imagesCollecter)] = $val[1];
            }
            elseif($val[0] === 'new')
                $imagesCollecter[count($imagesCollecter)] = $this->uploadReturnImage($val[1], "word_library/" , $word->id);
        };
        $word->images = json_encode($imagesCollecter);
        $word->sources = $remake['v_sources'];
        $word->modified_time = now();
        $word->save();

        //Update Word Dependencies here
        $this->updateWordDependency($word->id);

        //Return Succes
        $this->successReturn($word->keyname, "modify");
    }
    public function delete(Request $request, $id){
        //Get the copy data of its id
        $word = Word::find($id);

        //Delete its images
        foreach(json_decode($word->images, true) as $key => $val){
            $this->deleteImage('word_library/', trim($val, '.jpeg'));
        }

        //Delete the data
        Word::destroy($id);

        //Delete its content from user created copies

        //Delete its content from other dependencies and update each use the json search to search for it or use id:
        $wordDependencies = Word::where(function($query)use($word){
            $query->orWhere('relationyms', 'LIKE', '%' . "\"id\":\"$word->id\"" . '%')
                ->orWhere('hierarchy_map', 'LIKE', '%' . "\"id\":\"$word->id\"" . '%')
            ;
        })->get();

        foreach($wordDependencies as $key => $val){
            $this->updateWordDependency($val->id);
        }

        //Return Succes
        $this->successReturn($word->keyname, "delete");
    }



    //FUNCTIONALITY
    protected function getContents(){
        //Start Fetch
        $data = Word::select('word.*', 'rarity.name as rarity_name', 'rarity.level as rarity_level', 'rarity.color as rarity_color', 'language.name as language_name')->leftjoin('rarity', 'word.rarity_id', '=', 'rarity.id')->leftjoin('language','word.language_id', '=', 'language.id');

        //Required Condition


        //Search
        if(session('v_search') ){
            $data = $data->where( function($query){
                $query->orWhereRaw("LOWER(word.keyname) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'");
                    // ->orWhereRaw("LOWER(rarity.name) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'")
                    // ->orWhereRaw("LOWER(rarity.level) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'")
                    // ->orWhereRaw("LOWER(language.name) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'")
                    // ;
                //Get the Variation First
                // $Variation = Variation::all();
                // for($i = 0; $i < count($Variation); $i++){//Then Check each of those here
                //     $ref = $Variation->id;
                //     $query = $query->orWhereRaw("LOWER(JSON_VALUE(definition, `$.$ref.name`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                //         ->orWhereRaw("LOWER(JSON_VALUE(word.definition, `$.$ref.definition`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                //         ->orWhereRaw("LOWER(JSON_VALUE(word.variation, `$.$ref`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                //         ->orWhereRaw("LOWER(JSON_VALUE(word.pronounciation, `$.$ref.simple`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                //         ->orWhereRaw("LOWER(JSON_VALUE(word.pronounciation, `$.$ref.original`)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'" )
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.synonyms`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.antonyms`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.homonyms`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(examples, `$.$ref`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(examples, `$.$ref`) as CHAR)) LIKE '%".  HelpMoKo::cleanse(session('v_search')) ."%'")
                        // ;
                // }
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
        $data = $data->paginate(15)->onEachSide(2);

        // Add Ons and Update
        foreach($data->items() as $key => $val){
            $this->updateWordDependency($val->id);
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
    protected function getVariation(){
        $data = Variation::select('id','name');
        //Requirement

        //Search
        if( session('v_searchVariation') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(name) LIKE '%". HelpMoKo::cleanse(session('v_searchVariation'))."%'");
            });
        }
        return $data->orderBy('name', 'ASC')->limit(15)->get();
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
        return $data->orderBy('name', 'ASC')->limit(15)->get();
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
        return $data->orderBy('name', 'ASC')->limit(15)->get();
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
        return $data->orderBy('name', 'ASC')->limit(15)->get();
    }
    protected function getSynonyms($id = false){
        $data = Word::select('id', 'keyname as name');
        //Requirement
        if( $id ){
            $data = $data->whereNot('id', $id);
        }

        //Search
        if( session('v_searchSynonyms') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchSynonyms'))."%'");
            });
        }
        return $data->orderBy('name', 'ASC')->limit(15)->get();
    }
    protected function getAntonyms($id = false){
        $data = Word::select('id', 'keyname as name');
        //Requirement
        if( $id ){
            $data = $data->whereNot('id', $id);
        }

        //Search
        if( session('v_searchAntonyms') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchAntonyms'))."%'");
            });
        }
        return $data->orderBy('name', 'ASC')->limit(15)->get();
    }
    protected function getHomonyms($id = false){
        $data = Word::select('id', 'keyname as name');
        //Requirement
        if( $id ){
            $data = $data->whereNot('id', $id);
        }

        //Search
        if( session('v_searchHomonyms') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchHomonyms'))."%'");
            });
        }
        return $data->orderBy('name', 'ASC')->limit(15)->get();
    }
    protected function getTail($id = false){
        $data = Word::select('id', 'keyname as name');
        //Requirement
        if( $id ){
            $data = $data->whereNot('id', $id);
        }

        //Search
        if( session('v_searchTail') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchTail'))."%'");
            });
        }
        return $data->orderBy('name', 'ASC')->limit(15)->get();
    }
    protected function getSide($id = false){
        $data = Word::select('id', 'keyname as name');
        //Requirement
        if( $id ){
            $data = $data->whereNot('id', $id);
        }

        //Search
        if( session('v_searchSide') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchSide'))."%'");
            });
        }
        return $data->orderBy('name', 'ASC')->limit(15)->get();
    }
    protected function getHead($id = false){
        $data = Word::select('id', 'keyname as name');
        //Requirement
        if( $id ){
            $data = $data->whereNot('id', $id);
        }

        //Search
        if( session('v_searchHead') ){
            $data = $data->where( function($query){
                $query->orwhereRaw("LOWER(keyname) LIKE '%". HelpMoKo::cleanse(session('v_searchHead'))."%'");
            });
        }
        return $data->orderBy('name', 'ASC')->limit(15)->get();
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
         * - Hierarchy Map
         * - Origin
         * - Image
         * - Sources
         */
        //** JSON CHECK FIRST Since it is a FormData */
        $request->validate([
            'v_keyname'=>"required|json",
            'v_language'=>"required|json",
            'v_variation'=>"required|json",
            'v_varname'=>"required|json",
            'v_definition'=>"required|json",
            'v_pronounciation'=>"required|json",
            'v_example'=>"required|json",
            'v_rarity'=>"required|json",
            'v_attributes'=>"required|json",
            'v_relationyms'=>"required|json",
            'v_hierarchymap'=>"required|json",
            'v_origin'=>"required|json",
            'v_sources'=>"required|json",
        ]);
        //** Decode JSON */
        $remake = [
            "v_keyname" => json_decode($request->v_keyname, true),
            "v_language" => json_decode($request->v_language, true),
            "v_variation" => json_decode($request->v_variation, true),
            'v_varname' => json_decode($request->v_varname, true),
            "v_definition" => json_decode($request->v_definition, true),
            "v_pronounciation" => json_decode($request->v_pronounciation, true),
            "v_example" => json_decode($request->v_example, true),
            "v_rarity" => json_decode($request->v_rarity, true),
            "v_attributes" => json_decode($request->v_attributes, true),
            "v_relationyms" => json_decode($request->v_relationyms, true),
            "v_hierarchymap" => json_decode($request->v_hierarchymap, true),
            "v_origin" => json_decode($request->v_origin, true),
            "v_sources" => json_decode($request->v_sources, true),
            "v_images"=>$request->v_images,
        ];

        $variationIds = implode(",", array_map(function($n){
            return $n['id'];
        }, $remake['v_variation']  ));

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

            'v_varname'=>"required|array|required_array_keys:$variationIds",
            'v_varname.*'=>"required|string",

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

            'v_hierarchymap'=>"required|array|required_array_keys:head,side,tail",
            'v_hierarchymap.*'=>"nullable|array",
            'v_hierarchymap.*.*'=>"required|array|required_array_keys:id,name",
            'v_hierarchymap.*.*.id'=>"required|exists:word,id",
            'v_hierarchymap.*.*.name'=>"required|exists:word,keyname",

            'v_origin'=>"nullable|string|not_regex:/<script\b[^>]*>[\s\S]*?<\/script\s*>/",

            'v_images'=>"required|array|max:3",
            'v_images.*'=>[],

            'v_sources'=>"array|max:100",
            'v_sources.*'=>"required|string",
        ];
        $messages = [
            'v_keyname.required'=>"Keyname is required.",
            'v_keyname.regex'=>"Keyname must contain only letters and number.",
            'v_keyname.max'=>"Keyname character limit reached. The maximum is 64 characters.",

            'v_language.*.required'=>"Language is required.",
            'v_language.*.exists'=>"Invalid input data detected.",

            'v_varname.*.required'=>'Name for this word variation is required.',
            'v_varname.*.string'=>'Invalid input data detected.',

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

            'v_hierarchymap.*.array'=>"Invalid input data detected.",

            'v_origin.string'=>"Invalid input data detected.",
            'v_origin.not_regex'=>"Invalid input data detected.",

            //Images if ever,

            'v_sources.array'=>"Invalid input data detected.",
            'v_sources.max'=>"Only maximum of 100 data can be inputted.",
            'v_soruces.0.required'=>"Input is required.",
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
        }elseif($type == 'Modify'){
            $rules['v_images.*'] = Rule::forEach(function ( $value, $attribute) {
                $checkIfString = Validator::make(['value'=>$value], ['value'=>'nullable|array|required_array_keys:name']);
                if($checkIfString->fails()){
                    return [
                        "nullable",
                        "file",
                        "mimes:jpeg,jpg,png,gif,bimp,tiff,webp,svg",
                        "max:8192"
                    ];
                }else{
                    return [
                        "nullable",
                        "array",
                    ];
                }
            });
            $messages['v_images.*.string'] = "Image is not valid.";
            $messages['v_images.*.file'] = "Image is not a valid file.";
            $messages['v_images.*.mimes'] = "Image is not a valid file.";
            $messages['v_images.*.max'] = "File is too large, please upload less than 8mb only.";
        };


        $validated = Validator::make($remake, $rules, $messages);
        $validated->setAttributeNames([
           'v_sources.*'=>"Source",
        ]);

        $validated->validate();

        $remake['v_variation'] = json_encode($remake['v_variation']);
        $remake['v_varname'] = json_encode($remake['v_varname']);
        $remake['v_definition'] = json_encode($remake['v_definition']);
        $remake['v_pronounciation'] = json_encode($remake['v_pronounciation']);
        $remake['v_example'] = json_encode($remake['v_example']);
        $remake['v_attributes'] = json_encode($remake['v_attributes']);

        $remake['v_relationyms'] = json_encode($this->avoidWordDuplicate($remake['v_relationyms']));
        $remake['v_hierarchymap'] = json_encode($this->avoidWordDuplicate($remake['v_hierarchymap']));
        $remake['v_sources'] = json_encode($remake['v_sources']);

        if($type == "Modify" ){
            $remake['v_images'] = array_map(function($val){
                if($val == ""){
                    return ["delete"];
                }
                elseif( Validator::make(['val'=>$val], ['val'=>'file'])->fails() ){
                    $Existence = Word::where('images', 'LIKE', '%' . '"'.$val['name'].'"' . '%')->first();
                    if($Existence)
                        return ["retain", $val['name']];
                    else
                        return ["delete"];
                }
                else{
                    return ["new", $val];
                }
            }, $remake['v_images']);
        }

        return $remake;
    }
    protected function successReturn($name, $type = "add"){
        $flashData = [
            'Type'=>'success',
            'Title'=>match($type){
                "add"=>'Created Successfully',
                "modify"=>'Modified Succesfully',
                "delete"=>'Removed Successfully'
            },
            'Message'=>match($type){
                "add"=>"A new word \"".$name."\" was added to the magic system.",
                "modify"=>"The word \"".$name."\" was modified in the magic system.",
                "delete"=>"The word \"".$name."\" was removed from the magic system.",
            },
        ];
        return redirect()->back()->with( 'popFlash', $flashData);
    }
    protected function uploadReturnImage($image, $path, $name, $type="jpeg", $size = [2048, 2048]){
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
    protected function updateWordDependency($id){
        $word = Word::find($id);
        if(!$word)
            return false;
        //Update Variation
        $temp = json_decode($word->variation, true);
        if( count($temp) ){
            $Variation = Variation::class;
            $temp = array_filter($temp, function($val)use($Variation){
                $exist = $Variation::find($val['id']);
                if($exist)
                    return true;
                return false;
            });
            foreach($temp as $key => $val){
                $variation = Variation::find($val['id']);
                if($val['name'] != $variation->name){
                    $temp[$key]['name'] = $variation->name;
                }
            }
        }
        $word->variation = json_encode($temp);

        //Update Attributes
        $temp = json_decode($word->attributes, true);
        if( count($temp)){
            $Attribute = Attribute::class;
            $temp = array_filter($temp, function($val)use($Attribute){
                $exist = $Attribute::find($val['id']);
                if($exist)
                    return true;
                return false;
            });
            foreach($temp as $key =>$val){
                $attributes = Attribute::find($val['id']);
                if($val['name'] != $attributes->name){
                    $temp[$key]['name'] = $attributes->name;
                }
            };
        }
        $word->attributes = json_encode($temp);

        //Update Relationyms
        $Word = Word::class;
        //***** Strip If Word is not Actuall existed */
        $wordCheck = function($val)use($Word){
            $exist = $Word::find($val['id']);
            if($exist)
                return true;
            return false;
        };
        //***** Change name if other have also changed their name */
        $wordUpdate = function($val)use($Word){
            $thisword = $Word::find($val['id']);
            if($val['name'] != $thisword->keyname){
                $val['name'] = $thisword->keyname;
                return $val;
            }
            return $val;
        };
        //***** Unlink and Link Words */
        $ThisName = $word->keyname;
        $wordLink = function($data, $where)use($Word, $id, $ThisName){
            // //Ban Words That already Modified so that it will not be plug unnecessarily;
            // $Kotoban = [];

            //Search first the word where the instance of this word from $id ocurs
            $AiKotobaI = $Word::where( function($query)use($id, $where){
                switch($where){
                    case 'synonyms': case 'antonyms': case 'homonyms':
                        $query->where('relationyms', 'LIKE', '%' . "\"id\":\"$id\"" . '%');
                    break;
                    case 'tail': case 'side': case 'head':
                        $query->where('hierarchy_map', 'LIKE', '%' . "\"id\":\"$id\"" . '%');
                    break;
                }
            } )->get()->toArray(); //Convert it to array

            if(count($AiKotobaI) < 1) //IF there is no match proceed to insert on the word word if it exist
                goto PlugNewWord;

            //If there is then go here to rotate each value

            foreach($AiKotobaI as $key => $val){
                $KotobaData = [];
                switch($where){ //Get the instance where the data occurs
                    case 'synonyms': case 'antonyms': case 'homonyms':
                        $KotobaData = json_decode($val['relationyms'], true)[$where];
                    break;
                    case 'tail': case 'side': case 'head':
                        $KotobaData = json_decode($val['hierarchy_map'], true)[$where];
                    break;
                };

                if(!count($KotobaData)){
                    continue;
                }

                $KotobaId = $val['id'];
                $OldCount = count($KotobaData);//To skip saving if there nothing change
                $KotobaData = array_filter($KotobaData, function($val2)use($KotobaId,$data, $id){
                    $notExist = true;
                    if($val2['id'] == $id){//Check if this Kotoba Id is equals to the id of this word

                        $notExist = false;//Make it false first then rotate through the given array of this function; If none existed then it will remain false if it is then make it true
                        foreach($data as $key3=>$val3){
                            if($val3['id'] == $KotobaId){//check if the list of this word have the ID of the selected stuff from Kotoba;
                                $notExist = true;
                                break;
                            }

                        }
                    }
                    return $notExist;
                });

                if($OldCount == count($KotobaData)){
                    continue;
                }

                $AiKotobaII = $Word::find($KotobaId);
                switch($where){
                    case 'synonyms': case 'antonyms': case 'homonyms':
                        $temp = json_decode($val['relationyms'], true);
                        $temp[$where] = $KotobaData;
                        $AiKotobaII->relationyms = json_encode($temp);
                    break;
                    case 'tail': case 'side': case 'head':
                        $temp = json_decode($val['hierarchy_map'], true);
                        $temp[$where] = $KotobaData;
                        $AiKotobaII->hierarchy_map = json_encode($temp);
                    break;
                };

                $AiKotobaII->save();
            }

            // This will add link to the words that still don't have; Ban words will apply here to prevent readding
            PlugNewWord:
            foreach($data as $key => $val){
                $AiKotobaIII = $Word::find($val['id']);
                $KotobaData = [];
                switch($where){
                    case 'synonyms': case 'antonyms': case 'homonyms':
                        $KotobaData = json_decode($AiKotobaIII->relationyms, true)[$where];
                    break;
                    case 'tail': case 'side': case 'head':
                        $KotobaData = json_decode($AiKotobaIII->hierarchy_map, true)[$where];
                    break;
                };

                if(!count($KotobaData)){
                    $KotobaData = [ ['id'=>$id, 'name'=>$ThisName ], ];
                    goto PlugIt;
                }

                $exist = false;
                foreach($KotobaData as $key2 => $val2){
                    if($val2['id'] == $id){
                        $exist = true;
                        break;
                    }
                }
                if(!$exist){
                    $KotobaData[count($KotobaData)] = [ 'id'=>$id, 'name'=>$ThisName ];
                }else{
                    continue;
                }
                PlugIt:
                switch($where){
                    case 'synonyms': case 'antonyms': case 'homonyms':
                        $temp = json_decode($AiKotobaIII->relationyms, true);
                        $temp[$where] = $KotobaData;
                        $AiKotobaIII->relationyms = json_encode($temp);
                    break;
                    case 'tail': case 'side': case 'head':
                        $temp = json_decode($AiKotobaIII->hierarchy_map, true);
                        $temp[$where] = $KotobaData;
                        $AiKotobaIII->hierarchy_map = json_encode($temp);
                    break;
                };
                $AiKotobaIII->save();

            }
        };
        $temp = json_decode($word->relationyms, true);
        if( count($temp['synonyms']) ){
            $temp['synonyms'] = array_filter($temp['synonyms'], $wordCheck);
            $temp['synonyms'] = array_map($wordUpdate, $temp['synonyms']);
        }
        $wordLink($temp['synonyms'], 'synonyms');
        if( count($temp['antonyms']) ){
            $temp['antonyms'] = array_filter($temp['antonyms'], $wordCheck);
            $temp['antonyms'] = array_map($wordUpdate, $temp['antonyms']);
        }
        $wordLink($temp['antonyms'], 'antonyms');
        if( count($temp['homonyms']) ){
            $temp['homonyms'] = array_filter($temp['homonyms'], $wordCheck);
            $temp['homonyms'] = array_map($wordUpdate, $temp['homonyms']);
        }
        $wordLink($temp['homonyms'], 'homonyms');
        $word->relationyms = json_encode($temp);

        $temp = json_decode($word->hierarchy_map, true);
        if( count($temp['tail']) ){
            $temp['tail'] = array_filter($temp['tail'], $wordCheck);
            $temp['tail'] = array_map($wordUpdate, $temp['tail']);
        }
        $wordLink($temp['tail'], 'head');
        if( count($temp['side'])){
            $temp['side'] = array_filter($temp['side'], $wordCheck);
            $temp['side'] = array_map($wordUpdate, $temp['side']);
        }
        $wordLink($temp['side'], 'side');
        if( count($temp['head'])){
            $temp['head'] = array_filter($temp['head'], $wordCheck);
            $temp['head'] = array_map($wordUpdate, $temp['head']);
        }
        $wordLink($temp['head'], 'tail');
        $word->hierarchy_map = json_encode($temp);

        $word->modified_time = now();
        $word->save();



    }
    protected function avoidWordDuplicate($Content){
        //Initiate Band
        $Kotoban = [];

        //New Content Containter
        $ClenseContent = [];

        //Traverse for each Groups
        foreach($Content as $key => $val){
            $containedGroups = []; //Container for the data of each groups

            //Traverse the Contents of Groups
            foreach($val as $key2 => $val2){
                $Banned = false; //This will be use in itiration; Whem match this will become true;
                //Traverse the Ban Words if it existed
                foreach($Kotoban as $key3 => $val3){
                    if($val3 == $val2['id']){
                        $Banned = true;//Change to true because it matched
                        break;//Break since match is found already;
                    }
                }

                if($Banned)
                    continue; //Skip this current iteration since it is a banned words

                $containedGroups[count($containedGroups)] = $val2; //Insert the contents of this in the group;
                $Kotoban[count($Kotoban)] = $val2['id']; //Insert the match value to banlist if it didn't match
            };



            // After the traversal of each content of this group insert it now to the main content;
            $ClenseContent[$key] = $containedGroups;
        }

        //Return the clense Value
        return $ClenseContent;

    }
}
