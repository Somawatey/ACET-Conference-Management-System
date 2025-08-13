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
        Schema::create('author_infos', function (Blueprint $table) {
            $table->id();
            $table->string('author_name');
            $table->string('position_author')->nullable();
            $table->string('co_author')->nullable();
            $table->string('institute')->nullable();
            $table->string('cores_name')->nullable();
            $table->string('cores_email')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('author_infos');
    }
};
