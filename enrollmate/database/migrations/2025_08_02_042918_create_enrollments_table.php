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
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('class_group_id')->constrained()->onDelete('cascade');

            // Enrollment details
            $table->date('enrolled_at')->nullable();  // optional, when they were officially enrolled
            $table->enum('status', ['new', 'promoted', 'retained', 'transferred', 'dropped'])->default('new');

            $table->timestamps();

            $table->unique(['student_id', 'class_group_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
