<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Subject;
use App\Models\ClassGroup;
use App\Models\Teacher;
use App\Models\ClassGroupSubject;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $grades = [7, 8, 9, 10, 11, 12];

        // Get teachers
        $teachers = Teacher::all();
        if ($teachers->count() === 0) {
            $this->command->error('No teachers found. Please run TeacherSeeder first.');
            return;
        }

        foreach ($grades as $grade) {
            // 4 Regular Subjects
            $regularSubjects = [
                ['code' => "ENG{$grade}", 'name' => "English {$grade}"],
                ['code' => "MATH{$grade}", 'name' => "Mathematics {$grade}"],
                ['code' => "SCI{$grade}", 'name' => "Science {$grade}"],
                ['code' => "FIL{$grade}", 'name' => "Filipino {$grade}"],
            ];

            // 2 Special Subjects
            $specialSubjects = [
                ['code' => "ADV{$grade}", 'name' => "Advanced Science {$grade}"],
                ['code' => "RSCH{$grade}", 'name' => "Research {$grade}"],
            ];

            // Create subjects
            $allSubjects = array_merge($regularSubjects, $specialSubjects);
            foreach ($allSubjects as $subjectData) {
                Subject::create([
                    'code' => $subjectData['code'],
                    'name' => $subjectData['name'],
                    'is_special' => in_array($subjectData, $specialSubjects),
                ]);
            }

            // Assign to class groups for this grade
            $classGroups = ClassGroup::with('section.gradeLevel')
                ->whereHas('section.gradeLevel', fn($q) => $q->where('name', "Grade {$grade}"))
                ->get();

            foreach ($classGroups as $classGroup) {
                $teacherIndex = 0;

                if ($classGroup->section->is_special) {
                    $subjectsToAssign = Subject::where('is_special', true)
                        ->where('code', 'like', "%{$grade}%")
                        ->take(2)
                        ->get();
                } else {
                    $subjectsToAssign = Subject::where('is_special', false)
                        ->where('code', 'like', "%{$grade}%")
                        ->take(4)
                        ->get();
                }

                foreach ($subjectsToAssign as $subject) {
                    ClassGroupSubject::create([
                        'class_group_id' => $classGroup->id,
                        'subject_id' => $subject->id,
                        'teacher_id' => $teachers[$teacherIndex % $teachers->count()]->id,
                    ]);
                    $teacherIndex++;
                }
            }
        }

        $this->command->info('Subjects created and assigned to class groups.');
    }
}
