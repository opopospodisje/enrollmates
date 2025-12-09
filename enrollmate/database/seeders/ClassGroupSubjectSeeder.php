<?php

namespace Database\Seeders;

use App\Models\ClassGroup;
use App\Models\ClassGroupSubject;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class ClassGroupSubjectSeeder extends Seeder
{
    public function run(): void
    {
        $classGroups = ClassGroup::with('section.gradeLevel')->get();
        $teachers = Teacher::all();

        if ($teachers->count() === 0) {
            $this->command->error('No teachers found. Please run TeacherSeeder first.');

            return;
        }

        foreach ($classGroups as $classGroup) {
            // Skip if section or gradeLevel is missing
            if (! $classGroup->section || ! $classGroup->section->gradeLevel) {
                $this->command->warn("ClassGroup ID {$classGroup->id} has missing section or gradeLevel. Skipping.");

                continue;
            }

            $gradeName = $classGroup->section->gradeLevel->name;

            // Select subjects depending on section type
            if ($classGroup->section->is_special) {
                $subjects = Subject::where('is_special', true)
                    ->where('code', 'like', "%{$gradeName}%")
                    ->take(2)
                    ->get();
            } else {
                $subjects = Subject::where('is_special', false)
                    ->where('code', 'like', "%{$gradeName}%")
                    ->take(4)
                    ->get();
            }

            $teacherIndex = 0;

            foreach ($subjects as $subject) {
                ClassGroupSubject::create([
                    'class_group_id' => $classGroup->id,
                    'subject_id' => $subject->id,
                    'teacher_id' => $teachers[$teacherIndex % $teachers->count()]->id,
                ]);

                $teacherIndex++;
            }
        }

        $this->command->info('Subjects assigned to all class groups with correct counts.');

    }
}
