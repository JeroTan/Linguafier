<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpecialAccount extends Model
{
    use HasFactory;

    protected $table = 'specialaccount';
    protected $primaryKey = 'id';
    protected $keyType = ['id','string'];
    public $incrementing = false;
    public $timestamps = false;

    public function role(){
        return $this->belongsTo(Role::class);
    }
}
