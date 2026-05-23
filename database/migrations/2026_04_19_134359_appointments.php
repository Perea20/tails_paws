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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('restrict');
            $table->foreignId('pet_id')->constrained('pets')->onDelete('restrict');
            $table->foreignId('record_type_id')->constrained('record_types');
            $table->foreignId('staff_id')->constrained('staff')->onDelete('restrict');
            $table->date('date');
            $table->time('time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
