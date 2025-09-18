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
        Schema::table('agendas', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['paper_id']);
            
            // Modify the paper_id column to be nullable with default null
            $table->unsignedBigInteger('paper_id')->nullable()->default(null)->change();
            
            // Re-add the foreign key constraint with cascade delete
            $table->foreign('paper_id')->references('id')->on('papers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agendas', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['paper_id']);
            
            // Revert paper_id to required
            $table->unsignedBigInteger('paper_id')->nullable(false)->change();
            
            // Re-add the original foreign key constraint
            $table->foreign('paper_id')->references('id')->on('papers')->onDelete('cascade');
        });
    }
};
