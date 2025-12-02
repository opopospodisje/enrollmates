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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // optional
            $table->foreignId('applicant_id')->nullable()->constrained()->nullOnDelete(); // for tracking origin

            $table->string('lrn')->unique()->nullable(); // Learner Reference Number (optional)
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();

            $table->string('email')->unique();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->date('birthdate')->nullable();

            $table->boolean('is_graduated')->default(false);

            $table->boolean('has_special_needs')->default(false);
            $table->string('special_needs_type')->nullable();

            $table->boolean('is_4ps')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
