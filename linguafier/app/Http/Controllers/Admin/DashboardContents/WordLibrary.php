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
        ]);
    }
    public function modify_ui(Request $request, $id){
        return Inertia::render('Admin/DashboardContents/WordLibrary/Modify', [
            'pageUser'=>'Special',
            'adminPage'=>"Word",
            'data'=>Word::find($id),
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
    public function search_attribute(Request $request){

    }
    public function add_submit(Request $request){

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
                $query = $query->orWhereRaw("LOWER(word.keyname) LIKE '%". HelpMoKo::clense(session('v_search')) ."%'")
                    // ->orWhereRaw("LOWER(rarity.name) LIKE '%". HelpMoKo::clense(session('v_search')) ."%'")
                    ->orWhereRaw("LOWER(rarity.level) LIKE '%". HelpMoKo::clense(session('v_search')) ."%'")
                    // ->orWhereRaw("LOWER(language.name) LIKE '%". HelpMoKo::clense(session('v_search')) ."%'")
                    ;
                //Get the Variation First
                $Variation = Variation::all();
                for($i = 0; $i < count($Variation); $i++){//Then Check each of those here
                    $ref = $Variation->id;
                    $query = $query->orWhereRaw("LOWER(JSON_VALUE(definition, `$.$ref.name`)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'" )
                        ->orWhereRaw("LOWER(JSON_VALUE(word.definition, `$.$ref.definition`)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'" )
                        ->orWhereRaw("LOWER(JSON_VALUE(word.variation, `$.$ref`)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'" )
                        ->orWhereRaw("LOWER(JSON_VALUE(word.pronounciation, `$.$ref.simple`)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'" )
                        ->orWhereRaw("LOWER(JSON_VALUE(word.pronounciation, `$.$ref.original`)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'" )
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.synonyms`) as CHAR)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.antonyms`) as CHAR)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(relationyms, `$.$ref.homonyms`) as CHAR)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(examples, `$.$ref`) as CHAR)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'")
                        // ->orWhereRaw("LOWER(CAST(JSON_EXTRACT(examples, `$.$ref`) as CHAR)) LIKE '%".  HelpMoKo::clense(session('v_search')) ."%'")
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
    protected function quickValidate($type = "AddVariation", $type2="Image", $placeText = "word variation"){
        //**>> MAIN */
        $rules = [
            'v_name'=>[
                "required",
                "regex:/^[a-zA-Z0-9\,\.\s]*$/",
                "max:48",
            ],
        ];
        $messages = [
            "v_name.required"=>"Name of the ".$placeText." is required.",
            "v_name.regex"=>"Name of the ".$placeText." must contain only letters and number.",
            "v_name.max"=>"Name of the ".$placeText." character limit reached. The maximum is 48 characters.",
            "v_name.unique"=>"Name of the ".$placeText." is already existed in the system.",
        ];
        //**<< MAIN */

        //**>> Add-On */
        $ruleOptionName = "";
        switch($type){
            case "AddVariation": case "AddAttribute": case "AddRarity" : case "AddLanguage":
                $ruleOptionName = "unique:variation,name";
            break;
            case "ModifyVariation": case "ModifyAttribute": case "ModifyRarity": case "ModifyLanguage":
                $ruleOptionName = "unique:variation,name,".request()->route('id');
            break;
        }
        array_push($rules['v_name'], $ruleOptionName);
        $imageRule = [
            "required",
            "file",
            "mimes:jpeg,jpg,png,gif,bimp,tiff,webp,svg",
            "max:8192",
        ];
        $imageMessage = [
            'v_image.required'=>'Image is required.',
            'v_image.file'=>'The data that you have uploaded is not a file.',
            'v_image.mimes'=>'The data that you have uploaded is not a valid filetypes.',
            'v_image.max'=>"File is too large, please upload less 8mb only.",
        ];
        $colorRule = [
            "required",
            "regex:/^#([0-9a-fA-F]{6})$/"
        ];
        $colorMessage = [
            'v_color.required'=>'Color is required.',
            'v_color.regex'=>'Invalid color, please use hex code only.',
        ];
        $numberRule = [
            "required",
            "numeric",
            "min:0",
            "max:100",
        ];
        $numberMessage = [
            'v_level.required'=>"Level is required.",
            'v_level.numeric'=>"Level must be a number.",
            "v_level.min"=>"Level should not be less than 0.",
            'v_level.max'=>"Level should not be more than 100.",
        ];
        //**<< Add-On */
        switch($type){
            case "AddVariation":
                $rules['v_image'] = $imageRule;
                $messages = $messages + $imageMessage;
            break;
            case "AddAttribute":
                $rules['v_image'] = $imageRule;
                $messages = $messages + $imageMessage;
                $rules['v_color'] = $colorRule;
                $messages = $messages + $colorMessage;
            break;
            case "AddRarity":  case "ModifyRarity":
                $rules['v_level'] = $numberRule;
                $messages = $messages + $numberMessage;
                $rules['v_color'] = $colorRule;
                $messages = $messages + $colorMessage;
            break;
            case "ModifyVariation": case "ModifyAttribute":
                if($type2 == 'Image'){
                    $rules['v_image'] = $imageRule;
                    $messages = $messages + $imageMessage;
                }
            break;
        }
        return [$rules, $messages];
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
