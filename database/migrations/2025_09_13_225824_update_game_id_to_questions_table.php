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
         Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'game_id')) {
                $table->dropColumn('game_id');
            }
            
            $table->foreignId('game_id')
                  ->after('id')
                  ->constrained('games')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['game_id']);
            
            $table->dropColumn('game_id');
        });
    }
};
