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
        Schema::create('papers', function (Blueprint $table) {
            $table->id();
            $table->string('paper_title');
            $table->string('url')->nullable();
            $table->enum('topic', ['AI', 'ML', 'Data Science', 'Software Engineering', 'Computer Networks', 'Cybersecurity', 'Other']);
            $table->string('keyword')->nullable();
            $table->text('abstract')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('papers');
    }
};


