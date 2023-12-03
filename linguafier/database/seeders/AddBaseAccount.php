<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\SpecialAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddBaseAccount extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Role::create([
            [
            'id' => '1',
            'name' => 'owner',

            ],
        ]);
        SpecialAccount::create([
            [
                'id'=>'1',
                'username'=>'admin',
                'password'=>'admin',
                'role_id'=>'1',
                'modified_time' => now(),
            ]
        ]);
    }
}
