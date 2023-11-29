<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('useraccount', function($table){
            $table->string('id', 32)->primary();
            $table->string('username', 32);
            $table->string('password', 128);
            $table->string('email');
            $table->string('google_id')->nullable();
            $table->json('rank')->nullable();
            $table->timestamp('created_time');
            $table->dateTime('modified_time');
        });

        Schema::create('role', function($table){
            $table->string('id', 16)->primary();
            $table->string('name', 16)->nullable();
            $table->json('privilege')->nullable();
        });

        Schema::create('specialaccount', function($table){
            $table->string('id', 16)->primary();
            $table->string('username', 32);
            $table->string('password', 128);
            $table->string('role_id', 16)->nullable();
                $table->foreign('role_id')->references('id')->on('role')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamp('created_time');
            $table->dateTime('modified_time');
        });

        Schema::create('rank', function($table){
            $table->string('id', 16)->primary();
            $table->string('name', 64)->nullable();
            $table->string('color', 16)->nullable();
            $table->text('description')->nullable();
            $table->string('season', 16)->nullable();
            $table->string('image', 64)->nullable();
        });

        Schema::create('userword', function($table){
            $table->string('id', 64)->primary();
            $table->string('account_id', 32);
                $table->foreign('account_id')->references('id')->on('useraccount')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('word_id', 32);
                $table->foreign('word_id')->references('id')->on('word')->cascadeOnDelete()->cascadeOnUpdate();
            $table->json('definition')->nullable();
            $table->json('examples')->nullable(); //Max of 3
            $table->json('image')->nullable(); //Max of 3
            $table->timestamp('created_time');
            $table->dateTime('modified_time');
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('useraccount');
        Schema::dropIfExists('role');
        Schema::dropIfExists('specialaccount');
        Schema::dropIfExists('rank');
        Schema::dropIfExists('userword');
        Schema::enableForeignKeyConstraints();
    }
};
