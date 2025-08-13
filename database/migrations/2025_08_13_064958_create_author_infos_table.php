<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('author_infos', function (Blueprint $table) {
            $table->id();
            $table->string('author_name');
            $table->string('author_email'); // Add this
            $table->string('institute'); 
            $table->string('correspond_name')->nullable(); // Add this
            $table->string('correspond_email')->nullable(); // Add this
            $table->text('coauthors')->nullable(); // Rename from co_author
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('author_infos');
    }
};