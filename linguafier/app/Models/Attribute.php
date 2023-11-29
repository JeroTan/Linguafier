<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;

    protected $table = 'attribute';
    protected $primaryKey = 'id';
    protected $keyType = ['id','string'];
    public $incrementing = false;
    public $timestamps = false;


}
