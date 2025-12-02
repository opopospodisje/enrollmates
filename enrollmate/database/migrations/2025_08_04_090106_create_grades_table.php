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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();

            // Link to a specific enrollment (student + class group)
            $table->foreignId('enrollment_id')->constrained()->onDelete('cascade');

            // Link to class group subject
            $table->foreignId('class_group_subject_id')->constrained()->onDelete('cascade'); // Specific subject in that class

            // 4 quarters + final grade
            $table->decimal('first_quarter', 5, 2)->nullable();
            $table->decimal('second_quarter', 5, 2)->nullable();
            $table->decimal('third_quarter', 5, 2)->nullable();
            $table->decimal('fourth_quarter', 5, 2)->nullable();
            $table->decimal('final_grade', 5, 2)->nullable();

            $table->timestamps();

            // Optional: Ensure one grade per subject per enrollment
            $table->unique(['enrollment_id', 'class_group_subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
