<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserWord extends Model
{
    use HasFactory;

    protected $table = 'userword';
    protected $primaryKey = 'id';
    protected $keyType = ['id','string'];
    public $incrementing = false;
    public $timestamps = false;

    public function useraccount(){
        return $this->hasMany(UserAccount::class);
    }
    public function word(){
        return $this->hasMany(Word::class);
    }
}
