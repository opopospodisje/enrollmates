<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClassGroup;
use App\Models\Section;
use App\Models\SchoolYear;

class ClassGroupSeeder extends Seeder
{
    public function run(): void
    {
        $schoolYears = SchoolYear::all();

        if ($schoolYears->isEmpty()) {
            $this->command->error('No school years found. Please run SchoolYearSeeder first.');
            return;
        }

        $sections = Section::all();

        if ($sections->isEmpty()) {
            $this->command->error('No sections found. Please run SectionSeeder first.');
            return;
        }

        foreach ($schoolYears as $schoolYear) {
            foreach ($sections as $section) {
                ClassGroup::updateOrCreate(
                    [
                        'section_id' => $section->id,
                        'school_year_id' => $schoolYear->id,
                    ],
                    [
                        'student_limit' => 40,
                    ]
                );
            }
        }

        $this->command->info('Class groups created for all sections across all school years.');
    }
}
