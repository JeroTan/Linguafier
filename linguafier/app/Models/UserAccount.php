<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccount extends Model
{
    use HasFactory;

    protected $table = 'useraccount';
    protected $primaryKey = 'id';
    protected $keyType = ['id','string'];
    public $incrementing = false;
    public $timestamps = false;

    public function userword(){
        return $this->belongsTo(UserWord::class);
    }
}
