<?php

namespace App\Http\Controllers\Admin\DashboardContents;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Language;
use App\Models\Rarity;
use App\Models\Variation;
use Exception;
use HelpMoKo;
use Intervention\Image\ImageManager as Image;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use PDO;
use Throwable;

class WordAttribution extends Controller
{
    // STRUCT
    protected function sortKey($x){
        return match( $x ){
            "Rarity"=>['name', 'level'],
            default=>['name'],
        };
    }
    protected $pageSwitch = ['Variation', 'Attribute', 'Rarity', 'Language'];

    // GET
    public function __invoke(Request $request){
        return Inertia::render('Admin/DashboardContents/WordAttribution', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
            'data'=> $this->getContents(),
            'pgsw'=>$_GET['pgsw'] ?? null,
        ]);
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
    public function modify_variation_UI(Request $request, $id){
        return Inertia::render('Admin/DashboardContents/WordAttribution/ModifyVariation', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
            'data'=>Variation::find($id),
        ]);
    }
    public function modify_attribute_UI(Request $request, $id){
        return Inertia::render('Admin/DashboardContents/WordAttribution/ModifyAttribute', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
            'data'=>Attribute::find($id),
        ]);
    }
    public function modify_rarity_UI(Request $request, $id){
        return Inertia::render('Admin/DashboardContents/WordAttribution/ModifyRarity', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
            'data'=>Rarity::find($id),
        ]);
    }
    public function modify_language_UI(Request $request, $id){
        return Inertia::render('Admin/DashboardContents/WordAttribution/ModifyLanguage', [
            'pageUser'=>'Special',
            'adminPage'=>"Attribute",
            'data'=>Language::find($id),
        ]);
    }

    // POST
    public function changeContents(Request $request){
        //Verify Data
        //Page

        $request->validate([
            'c_pageSwitch'=>'required|in:'.implode(",",$this->pageSwitch),
        ]);

        //Search
        $request->validate([
            'v_search' => 'nullable|max:256',
            'v_sort' => 'required',
        ], [
            'v_search.max'=>'Search Limit Reached My Friend.'
        ]);

        //Sort
        $sortVerify = [];
        $sortRule = [];
        try{
            foreach($request->v_sort as $key => $val){
                if( !in_array($val['Ref'], $this->sortKey($request->c_pageSwitch)) )
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

        //Return
        return redirect()->back()->with(['c_pageSwitch'=>$request->c_pageSwitch, 'v_search'=>$request->v_search, 'v_sort'=>$request->v_sort, ]);
    }
    public function add_variation_submit(Request $request){
        //Verify Data
        $request->validate(...$this->quickValidate());

        //Compile Data

        //Create New Variation
        $newVariation = new Variation;
        $newVariation->id = HelpMoKo::generateID('OnlyMeChanics', 8);
        $newVariation->name = $request->v_name;
        $newVariation->image = $this->uploadReturnFile($request->v_image, "word_variation/" ,$newVariation->name);
        $newVariation->save();

        //Return Success
        $this->successReturn("word variation", $newVariation->name);
    }
    public function add_attribute_submit(Request $request){
        //Verify Data
        $request->validate(...$this->quickValidate("AddAttribute", "", "word attribute"));
        //Compile Data

        //Create New Attribute
        $newAttribute = new Attribute;
        $newAttribute->id = HelpMoKo::generateID('OnlyMeChanics', 8);
        $newAttribute->name = $request->v_name;
        $newAttribute->image = $this->uploadReturnFile($request->v_image, "word_attribute/" ,$newAttribute->name);
        $newAttribute->color = $request->v_color;
        $newAttribute->save();

        //Return Success
        $this->successReturn("word variation", $newAttribute->name);
    }
    public function add_rarity_submit(Request $request){
        //Verify Data
        $request->validate(...$this->quickValidate("AddRarity", "", "word rarity"));
        //Compile Data

        //Create New Rarity
        $newRarity = new Rarity;
        $newRarity->id = HelpMoKo::generateID('OnlyMeChanics', 8);
        $newRarity->name = $request->v_name;
        $newRarity->level = $request->v_level;
        $newRarity->color = $request->v_color;
        $newRarity->save();

        //Return Success
        $this->successReturn("word rarity", $newRarity->name);
    }
    public function add_language_submit(Request $request){
        //Verify Data
        $request->validate(...$this->quickValidate("AddLanguage", "", "language"));
        //Compile Data

        //Create New Rarity
        $newLanguage = new Language;
        $newLanguage->id = HelpMoKo::generateID('OnlyMeChanics', 8);
        $newLanguage->name = $request->v_name;
        $newLanguage->save();

        //Return Success
        $this->successReturn("language", $newLanguage->name);
    }
    public function modify_variation_submit(Request $request, $id){
        //Validate
        $ImageValidate = Validator::make(['v_image'=> $request->v_image], ['v_image'=>"required|file"]);
        if($ImageValidate->fails()){
            $includeImage = false;
            $request->validate(...$this->quickValidate('ModifyVariation', ""));
        }else{
            $includeImage = true;
            $request->validate(...$this->quickValidate('ModifyVariation'));
        };

        // Compile Data

        //Modify Variation
        $variation = Variation::find($id);
        if($includeImage){
            $this->deleteImage("word_variation/", trim($variation->image, ".png"));
            $variation->image = $this->uploadReturnFile($request->v_image,  "word_variation/", $request->v_name);
        }
        $variation->name = $request->v_name;
        $variation->save();

        //Return Success
        $this->successReturn("Word variation", $variation->name, "modify");
    }
    public function modify_attribute_submit(Request $request, $id){
        //Validate
        $ImageValidate = Validator::make(['v_image'=> $request->v_image], ['v_image'=>"required|file"]);
        if($ImageValidate->fails()){
            $includeImage = false;
            $request->validate(...$this->quickValidate('ModifyAttribute', "", "word attribute"));
        }else{
            $includeImage = true;
            $request->validate(...$this->quickValidate('ModifyAttribute', "Image", "word attribute"));
        };

        //Compile Data

        //Modify Attribute
        $attribute = Attribute::find($id);
        if($includeImage){
            $this->deleteImage("word_variation/", trim($attribute->image, ".png"));
            $attribute->image = $this->uploadReturnFile($request->v_image,  "word_attribute/", $request->v_name);
        }
        $attribute->name = $request->v_name;
        $attribute->color = $request->v_color;
        $attribute->save();

        //Return Success
        $this->successReturn("Word attribute", $attribute->name, "modify");

    }
    public function modify_rarity_submit(Request $request, $id){
        //Validate
        $request->validate(...$this->quickValidate("ModifyRarity", "", "word rarity"));
        //Compile Data

        //Modify Rarity
        $rarity = Rarity::find($id);
        $rarity->name = $request->v_name;
        $rarity->level = $request->v_level;
        $rarity->color = $request->v_color;
        $rarity->save();

        //Return Success
        $this->successReturn("Word rarity", $rarity->name, "modify");
    }
    public function modify_language_submit(Request $request, $id){
        //Verify Data
        $request->validate(...$this->quickValidate("ModifyLanguage", "", "language"));
        //Compile Data

        //Create New Rarity
        $language = Language::find($id);
        $language->name = $request->v_name;
        $language->save();

        //Return Success
        $this->successReturn("language", $language->name, "modify");
    }
    public function delete_variation(Request $request, $id){
        //Delete
        $variation = Variation::find($id);
        $this->deleteImage("word_variation/", trim($variation->image, ".png"));
        Variation::destroy($id);

        //Return Success
        $this->successReturn("Word variation", $variation->name, "delete");
    }
    public function delete_attribute(Request $request, $id){
        //Delete
        $attribute = Attribute::find($id);
        $this->deleteImage("word_variation/", trim($attribute->image, ".png"));
        Attribute::destroy($id);

        //Return Success
        $this->successReturn("Word attribute", $attribute->name, "delete");
    }
    public function delete_rarity(Request $request, $id){
        //Delete
        $rarity = Rarity::find($id);
        Rarity::destroy($id);

        //Return Success
        $this->successReturn("Word rarity", $rarity->name, "delete");
    }
    public function delete_language(Request $request, $id){
        //Delete
        $language = Language::find($id);
        Language::destroy($id);

        //Return Success
        $this->successReturn("Language", $language->name, "delete");
    }

    // Functionality
    protected function getContents(){
        //Start Fetch
        $data = null;

        //Select Base On What is Looking For
        $data = match( session('c_pageSwitch') ? session('c_pageSwitch') : ($_GET['pgsw']??"Variation") ){
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
                $query->orWhereRaw("LOWER(name) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'");
                if( session('c_pageSwitch') == "Rarity")
                    $query->orWhereRaw("LOWER(level) LIKE '%". HelpMoKo::cleanse(session('v_search')) ."%'");
            });
        }

        //Filters

        //Sort
        if(session('v_sort')){
            foreach(session('v_sort') as $key => $val){
                $data = $data->orderBy($val['Ref'], $val['Sort']);
            }
        }else{
            foreach($this->sortKey( session('c_pageSwitch') ) as $key => $val){
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
    protected function successReturn($type, $name, $type2 = "create"){
        $flashData = [
            'Type'=>'success',
            'Title'=>match($type2){
                "create"=>'Created Successfully',
                "modify"=>'Modified Succesfully',
                "delete"=>'Removed Successfully'
            },
            'Message'=>match($type2){
                "create"=>"A new ".$type." name \"".$name."\" was added to the magic system.",
                "modify"=>$type." name \"".$name."\" was modified in the magic system.",
                "delete"=>$type." name \"".$name."\" was removed from the magic system.",
            },
        ];
        return redirect()->back()->with( 'popFlash', $flashData);
    }
    protected function uploadReturnFile($image, $path, $name, $type="png", $size = [1080, 1080]){
        $image = $this->refineImage($image);
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
    protected function refineImage($image, $size = [1080, 1080]){
        $Image = new Image(new ImagickDriver());
        $Image = $Image->read(($image));
        $Image = $Image->scale($size[0], $size[1]);
        $Image = $Image->toPng();
        return $Image;
    }

}
