<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleToPlayersTable extends Migration
{
    public function up()
    {
        Schema::table('players', function (Blueprint $table) {
            $table->string('role')->default('user'); // user, premium, admin
        });
    }

    public function down()
    {
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
}