<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\ClassGroup;
use App\Models\ClassGroupSubject;
use App\Models\Grade;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        // 1️⃣ Get the first student (assuming StudentSeeder created one)
        $student = Student::first();

        if (!$student) {
            $this->command->error('No student found. Please run StudentSeeder first.');
            return;
        }

        // 2️⃣ Get a regular class group (not special) in the active school year
        $classGroup = ClassGroup::whereHas('section', fn($q) => $q->where('is_special', false))
            ->whereHas('schoolYear', fn($q) => $q->where('is_active', true))
            ->first();

        if (!$classGroup) {
            $this->command->error('No regular class group found for active school year.');
            return;
        }

        // 3️⃣ Create the enrollment
        $enrollment = Enrollment::create([
            'student_id' => $student->id,
            'class_group_id' => $classGroup->id,
            'enrolled_at' => now(),
            'status' => 'new',
        ]);

        // 4️⃣ Create blank grades for each subject in the class group
        $subjects = ClassGroupSubject::where('class_group_id', $classGroup->id)->get();

        foreach ($subjects as $subject) {
            Grade::create([
                'enrollment_id' => $enrollment->id,
                'class_group_subject_id' => $subject->id,
                'first_quarter' => rand(75, 100),
                'second_quarter' => null,
                'third_quarter' => null,
                'fourth_quarter' => null,
                'final_grade' => null,
            ]);
        }

        $this->command->info("Student {$student->first_name} {$student->last_name} enrolled in {$classGroup->section->name} ({$classGroup->schoolYear->name}).");
    }
}
