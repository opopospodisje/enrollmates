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

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Get all grade levels
        $gradeLevels = GradeLevel::orderBy('id')->get()->keyBy('name');

        // Get all school years sorted by ID descending (latest first)
        $schoolYears = SchoolYear::orderBy('id', 'desc')->get()->values();

        // Find the current/latest school year
        $currentSchoolYear = SchoolYear::where('name', '2025–2026')->first();

        if (! $currentSchoolYear) {
            $this->command->error('Current school year (2025–2026) not found.');

            return;
        }

        // Number of students per grade
        $studentsCount = 50;

        for ($i = 0; $i < $studentsCount; $i++) {
            // Random current grade between 7 and 12
            $currentGradeNum = rand(7, 12);

            // Build the grade history
            $gradeHistory = [];
            for ($g = $currentGradeNum; $g >= 7; $g--) {
                $gradeHistory[] = "Grade $g";
            }
            $gradeHistory = array_reverse($gradeHistory); // From Grade 7 → current grade

            // Get correct school years (latest first) and reverse to align with grade history
            $schoolYearsForStudent = $schoolYears->take(count($gradeHistory))->reverse()->values();

            if (count($schoolYearsForStudent) < count($gradeHistory)) {
                $this->command->error("Not enough school years to assign to student #{$i}.");

                continue;
            }

            // Create unique email
            $uniqueEmail = "student{$i}_".uniqid().'@example.com';

            $faker = \Faker\Factory::create();

            $firstName = $faker->firstName();
            $lastName = $faker->lastName();
            $middleName = $faker->optional()->firstName();
            $suffix = $faker->optional()->suffix();
            $gender = $faker->randomElement(['male', 'female']);
            $email = $faker->unique()->safeEmail();
            $contactNumber = $faker->numerify('09#########');
            $address = $faker->address();
            $birthdate = $faker->date('Y-m-d', '2010-01-01');

            // Create applicant
            $applicant = Applicant::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'middle_name' => $middleName,
                'suffix' => $suffix,
                'email' => $email,
                'contact_number' => $contactNumber,
                'address' => $address,
                'gender' => $gender,
                'birthdate' => $birthdate,
                'school_year_id' => $currentSchoolYear->id,
                'status' => 'accepted',
            ]);

            // Create user
            $user = User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'contact_number' => $contactNumber,
                'address' => $address,
                'password' => bcrypt('password'),
            ]);
            $user->assignRole('student');

            // Create student
            $student = Student::create([
                'user_id' => $user->id,
                'applicant_id' => $applicant->id,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'middle_name' => $middleName,
                'suffix' => $suffix,
                'email' => $email,
                'contact_number' => $contactNumber,
                'address' => $address,
                'gender' => $gender,
                'birthdate' => $birthdate,
            ]);

            // Loop through grade history and assign enrollments
            foreach ($gradeHistory as $index => $gradeName) {
                $schoolYear = $schoolYearsForStudent[$index];
                $gradeLevel = $gradeLevels[$gradeName] ?? null;

                if (! $schoolYear || ! $gradeLevel) {
                    $this->command->error("Missing data for $gradeName / $schoolYear->name.");

                    continue;
                }

                $classGroups = ClassGroup::whereHas('section', function ($q) use ($gradeLevel) {
                    $q->where('grade_level_id', $gradeLevel->id);
                })
                    ->where('school_year_id', $schoolYear->id)
                    ->get();

                if ($classGroups->isEmpty()) {
                    $this->command->error("No class groups found for {$gradeName} in {$schoolYear->name}.");

                    continue;
                }

                // Only select class groups that are not full
                $classGroupsWithSpace = $classGroups->filter(function ($cg) {
                    return $cg->enrollments()->count() < $cg->student_limit;
                })->values();

                if ($classGroupsWithSpace->isEmpty()) {
                    $this->command->error("All class groups for {$gradeName} in {$schoolYear->name} are full.");

                    continue;
                }

                $classGroup = $classGroupsWithSpace->random();

                $status = ($gradeName == 'Grade 7') ? 'new' : 'promoted';

                $enrollment = Enrollment::create([
                    'student_id' => $student->id,
                    'class_group_id' => $classGroup->id,
                    'enrolled_at' => now(),
                    'status' => $status,
                ]);

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
                        'final_grade' => round($final_grade, 2),
                    ]);
                }
            }
        }

        $this->command->info("✅ {$studentsCount} students enrolled, all ending in 2025–2026.");
    }
}
