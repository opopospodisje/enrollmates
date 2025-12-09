<?php

namespace Database\Seeders;

use App\Models\Applicant;
use App\Models\ClassGroup;
use App\Models\ClassGroupSubject;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\GradeLevel;
use App\Models\SchoolYear;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class SpecificStudentSeeder extends Seeder
{
    public function run(): void
    {
        // Define grade levels and corresponding school years
        $gradeLevels = [
            'Grade 7' => '2020–2021',
            'Grade 8' => '2021–2022',
            'Grade 9' => '2022–2023',
            'Grade 10' => '2023–2024',
            'Grade 11' => '2024–2025',
            'Grade 12' => '2025–2026',
        ];

        // Create the applicant with fixed info
        $schoolYearForApplicant = SchoolYear::where('name', '2025–2026')->first();

        if (! $schoolYearForApplicant) {
            $this->command->error('Active school year (2025–2026) not found.');

            return;
        }

        $applicant = Applicant::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'middle_name' => 'A',
            'suffix' => null,
            'email' => 'john.doe@example.com',
            'contact_number' => '09171234567',
            'address' => '123 Sample St.',
            'gender' => 'male',
            'birthdate' => '2008-01-01',
            'school_year_id' => $schoolYearForApplicant->id,
            'status' => 'accepted',
        ]);

        // Create user linked to applicant
        $user = User::create([
            'first_name' => $applicant->first_name,
            'last_name' => $applicant->last_name,
            'email' => $applicant->email,
            'contact_number' => $applicant->contact_number,
            'address' => $applicant->address,
            'password' => bcrypt('password'),
        ]);
        $user->assignRole('student');

        // Create student linked to user and applicant
        $student = Student::create([
            'user_id' => $user->id,
            'applicant_id' => $applicant->id,
            'first_name' => $applicant->first_name,
            'last_name' => $applicant->last_name,
            'middle_name' => $applicant->middle_name,
            'suffix' => $applicant->suffix,
            'email' => $user->email,
            'contact_number' => $applicant->contact_number,
            'address' => $applicant->address,
            'gender' => $applicant->gender,
            'birthdate' => $applicant->birthdate,
        ]);

        foreach ($gradeLevels as $gradeName => $yearName) {
            $schoolYear = SchoolYear::where('name', $yearName)->first();
            $gradeLevel = GradeLevel::where('name', $gradeName)->first();

            if (! $schoolYear) {
                $this->command->error("School year '{$yearName}' not found. Skipping $gradeName enrollment.");

                continue;
            }

            if (! $gradeLevel) {
                $this->command->error("Grade level '{$gradeName}' not found. Skipping enrollment for {$yearName}.");

                continue;
            }

            // Find class group for this grade level and school year
            $classGroup = ClassGroup::whereHas('section', function ($q) use ($gradeLevel) {
                $q->where('grade_level_id', $gradeLevel->id);
            })
                ->where('school_year_id', $schoolYear->id)
                ->first();

            if (! $classGroup) {
                $this->command->error("No class group found for grade {$gradeName} in school year {$yearName}. Skipping.");

                continue;
            }

            // Set enrollment status based on the grade level
            $status = ($gradeName == 'Grade 7') ? 'new' : 'promoted';

            // Create enrollment for student in this class group
            $enrollment = Enrollment::create([
                'student_id' => $student->id,
                'class_group_id' => $classGroup->id,
                'enrolled_at' => now(),
                'status' => $status,
            ]);

            // Create initial grades for all subjects in this class group
            $subjects = ClassGroupSubject::where('class_group_id', $classGroup->id)->get();

            foreach ($subjects as $subject) {
                $first_quarter = rand(75, 95);
                $second_quarter = rand(75, 95);
                $third_quarter = rand(75, 95);
                $fourth_quarter = rand(75, 95);

                $final_grade = ($first_quarter + $second_quarter + $third_quarter + $fourth_quarter) / 4;

                Grade::create([
                    'enrollment_id' => $enrollment->id,
                    'class_group_subject_id' => $subject->id,
                    'first_quarter' => $first_quarter,
                    'second_quarter' => $second_quarter,
                    'third_quarter' => $third_quarter,
                    'fourth_quarter' => $fourth_quarter,
                    'final_grade' => round($final_grade, 2), // Round to 2 decimal places if needed
                ]);
            }
        }

        $this->command->info('✅ John Doe has been enrolled.');

    }
}
