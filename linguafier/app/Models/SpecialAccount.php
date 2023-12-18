<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User;
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

    protected $fillable = [
        'id',
        'username',
        'password',
        'modified_time',
    ];
    protected $hidden = [
        'password',
    ];

    public function role(){
        return $this->belongsTo(Role::class);
    }
}
