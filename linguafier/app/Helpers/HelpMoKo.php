<?php

use App\Models\Attribute;
use App\Models\Variation;
use App\Models\Word;
use Illuminate\Support\Facades\Hash;

class HelpMoKo{
    public static function generateID($moreSalt = '', $idLength = 6, $extended = false){
        date_default_timezone_set("Asia/Manila");
        $Year = substr(date('Y').'', 0, 4);
        $Day = substr(date('z')+1000, 1, 3);
        $Hour = date('H');
        $Salt1 = substr(uniqid(), rand(0, 10), 3);
        $Salt2 = substr(uniqid(), 8, 5);
        $Salt3 = chr(rand(97, 122)).chr(rand(97, 122)).chr(rand(97, 122));
        $Salt4 = $extended? uniqid() : '';
        $uniqueID = $Hour.$Salt1.$Year.$Salt2.$Day.$Salt3.$Salt4;
        $uniqueID = substr(strrev($uniqueID), 0, $idLength);

        $uniqueID = $uniqueID.HelpMoKo::vignereEncrypt(substr($moreSalt, 0, $idLength), $uniqueID, true);
        return $uniqueID;
    }

    public static function vignereEncrypt($data, $key, $encrypting = true)
    {
        $dataLength = strlen($data);
        $keyLength = strlen($key);

        if($dataLength < $keyLength)
            $key = substr($key, 0, $dataLength);
        elseif($keyLength < $dataLength)
        {
            $key = floor($dataLength / $keyLength) < 2?$key.substr($key, 0, $dataLength - $keyLength):str_repeat($key, floor($dataLength / $keyLength)).substr($key, 0, $dataLength % $keyLength);
        }
        $keyLength = strlen($key);

        $streamReference = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'; //REFACTOR THIS ONE FOR SPECIAL CHARACTERS LIKE PASSWORDS
        $modifiedData = '';
        for($i = 0; $i < $keyLength; $i++){
            if($encrypting == true)
                $modifiedData .= $streamReference[ (strpos($streamReference, $key[$i]) + strpos($streamReference, $data[$i])) % strlen($streamReference) ];
            else
                $modifiedData .= $streamReference[ ($position = strpos($streamReference, $data[$i]) - strpos($streamReference, $key[$i]))< 0?strlen($streamReference)+$position:$position ];

        }
        return $modifiedData;
    }

    public static function cleanse($value){
        return htmlspecialchars(addslashes(strtolower($value)));
    }


    public static function updateWordDependency($id){
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
}
