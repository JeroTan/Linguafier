<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    use HasFactory;

    protected $table = 'word';
    protected $primaryKey = 'id';
    protected $keyType = ['id','string'];
    public $incrementing = false;
    public $timestamps = false;

    public function rarity(){
        return $this->belongsTo(Rarity::class);
    }
    public function language(){
        return $this->belongsTo(Language::class);
    }
}
