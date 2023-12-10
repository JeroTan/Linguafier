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
            'privilege' => '{"Manage Special User":true,"Manage Wizard":true,"Manage Wizard Rank":true,"Manage Word Library":true,"Manage Word Attributes":true,"Manage Roles":true}',
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
