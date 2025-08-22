<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('submissions', 'decision_id')) {
            Schema::table('submissions', function (Blueprint $table) {
                try {
                    $table->dropForeign(['decision_id']);
                } catch (\Throwable $e) {
                    // Ignore if FK does not exist
                }
                $table->dropColumn('decision_id');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('submissions', 'decision_id')) {
            Schema::table('submissions', function (Blueprint $table) {
                $table->foreignId('decision_id')->nullable()->constrained('decisions')->nullOnDelete();
            });
        }
    }
};
