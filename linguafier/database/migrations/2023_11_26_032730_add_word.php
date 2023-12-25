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
        Schema::create('attribute', function (Blueprint $table) {
            $table->string('id', 16)->primary();
            $table->string('name', 16)->nullable();
            $table->string('image', 16)->nullable();
            $table->string('color', 16)->nullable();
        });

        Schema::create('variation', function (Blueprint $table) {
            $table->string('id', 16)->primary();
            $table->string('name', 16)->nullable();
            $table->string('image', 16)->nullable();
        });

        Schema::create('rarity', function (Blueprint $table) {
            $table->string('id', 16)->primary();
            $table->string('name', 16)->nullable();
            $table->integer('level');
            $table->string('color', 16)->nullable();
        });

        Schema::create('language', function (Blueprint $table) {
            $table->string('id', 16)->primary();
            $table->string('name', 16)->nullable();
        });

        Schema::create('word', function($table){
            $table->string('id', 32)->primary();
            $table->text('keyname');
            $table->json('defintion')->nullable();
            $table->json('variation')->nullable();
            $table->string('rarity_id', 16)->nullable();
                $table->foreign('rarity_id')->references('id')->on('rarity')->nullOnDelete()->cascadeOnUpdate();
            $table->string('language_id', 16)->nullable();
                $table->foreign('language_id')->references('id')->on('language')->nullOnDelete()->cascadeOnUpdate();
            $table->json('pronounciation')->nullable();
            $table->json('attributes')->nullable();
            $table->json('relationyms')->nullable();
            $table->json('heirarchy_map')->nullable();
            $table->json('examples')->nullable();
            $table->text('origin')->nullable();
            $table->json('image')->nullable(); //Max of 3
            $table->json('sources')->nullable();
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
        Schema::dropIfExists('attribute');
        Schema::dropIfExists('variation');
        Schema::dropIfExists('rarity');
        Schema::dropIfExists('language');
        Schema::dropIfExists('word');
        Schema::enableForeignKeyConstraints();
    }
};
