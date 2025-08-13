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
            $table->foreignId('user_id')->constrained('users'); // Author
            $table->foreignId('conference_id')->constrained('conferences'); // Which conference
            $table->enum('status', ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'needs_revision'])->default('draft');
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
