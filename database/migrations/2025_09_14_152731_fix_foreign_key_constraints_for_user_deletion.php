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
        // Fix reviews table foreign key constraint
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['reviewer_id']);
            $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Fix submissions table foreign key constraint  
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Fix decisions table foreign key constraint
        Schema::table('decisions', function (Blueprint $table) {
            $table->dropForeign(['organizer_id']);
            $table->foreign('organizer_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore original constraints
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['reviewer_id']);
            $table->foreign('reviewer_id')->references('id')->on('users');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('decisions', function (Blueprint $table) {
            $table->dropForeign(['organizer_id']);
            $table->foreign('organizer_id')->references('id')->on('users');
        });
    }
};
