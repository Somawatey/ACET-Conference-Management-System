<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('paper_id')->constrained('papers');
            $table->foreignId('author_info_id')->constrained('author_infos'); // Link to author_infos
            $table->foreignId('decision_id')->nullable()->constrained('decisions');
            
            // Only submission-specific fields
            $table->string('track');
            $table->boolean('submitted_elsewhere')->default(false);
            $table->boolean('original_submission')->default(true);
            
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};