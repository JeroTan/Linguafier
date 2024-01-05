<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Http\Request;

class HeirarchyMapNodes extends Controller
{
    // Post
    public function requestMap(Request $request){
        $rules = [
            'getAllMapNodes'=>"required|array|required_array_keys:head,side,tail",
            'getAllMapNodes.*'=>"nullable|array",
            'getAllMapNodes.*.*'=>"required|array|required_array_keys:id,name",
            'getAllMapNodes.*.*.id'=>"required|exists:word,id",
            'getAllMapNodes.*.*.name'=>"required|exists:word,keyname",
        ];
        $request->validate($rules);
        session()->flash('getAllMapNodes', $this->getMap($request->getAllMapNodes));
        return redirect()->back()->with('getAllMapNodes', $this->getMap($request->getAllMapNodes));
    }

    //Functional
    protected function getMap($WordData){
        //$Word = Word::class;

        //Get The Copy of Data
        $mirrorMap = $WordData;
        $mirrorMap['tail'] = $this->getMoreWord(5, $mirrorMap['tail'], 'tail');
        $mirrorMap['head'] = $this->getMoreWord(5, $mirrorMap['head'], 'head' );

        return $mirrorMap;
    }

    //Recursive Function to get more words the is linked together;
    function getMoreWord($depth, $data, $direction = "head"){
        //If the depth reach zero then return it to the owner;
        if($depth <= 0 || count($data) <= 0){
            return [];
        };

        //Rotate Through its data;
        $rotator = $data;
        foreach($rotator as $key => $val){
            //Mirror the value first to make it editable;
            $mirrorVal = $val;

            //Get the reference of that word
            $wordRef = Word::find($val['id'])->toArray();

            //This is where recurssion happens to get its link data here
            $mirrorVal[$direction] = $this->getMoreWord( $depth-1, json_decode($wordRef['heirarchy_map'], true)[$direction], $direction );
            $mirrorVal['open'] = false; //This is for frontend;

            //Finally collect all the data and modify it in the $data[$key]
            $data[$key] = $mirrorVal;
        };

        // Return its data after the recursively get the data
        return $data;

    }





}
