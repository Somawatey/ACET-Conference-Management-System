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
        Schema::create('conference_sessions', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('conference_id')->constrained('conferences');
            $table->string('organization')->nullable();
            $table->string('room')->nullable();
            $table->dateTime('time');
            $table->foreignId('paper_id')->nullable()->constrained('papers');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conference_sessions');
    }
};
