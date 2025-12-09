<?php

namespace Database\Seeders;

use App\Models\GradeLevel;
use App\Models\Section;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    public function run(): void
    {
        $grade7 = GradeLevel::where('name', 'Grade 7')->first();
        $grade8 = GradeLevel::where('name', 'Grade 8')->first();
        $grade9 = GradeLevel::where('name', 'Grade 9')->first();
        $grade10 = GradeLevel::where('name', 'Grade 10')->first();
        $grade11 = GradeLevel::where('name', 'Grade 11')->first();
        $grade12 = GradeLevel::where('name', 'Grade 12')->first();

        // Grade 7 Regular
        foreach (['Honesty', 'Respect'] as $name) {
            Section::create([
                'name' => $name,
                'grade_level_id' => $grade7->id,
                'is_special' => false,
            ]);
        }

        // Grade 7 Special
        Section::create([
            'name' => 'Einstein',
            'grade_level_id' => $grade7->id,
            'is_special' => true,
            'cutoff_grade' => 85,
        ]);

        // Grade 8 Regular
        foreach (['Emerald', 'Ruby'] as $name) {
            Section::create([
                'name' => $name,
                'grade_level_id' => $grade8->id,
                'is_special' => false,
            ]);
        }

        // Grade 8 Special
        Section::create([
            'name' => 'Newton',
            'grade_level_id' => $grade8->id,
            'is_special' => true,
            'cutoff_grade' => 85,
        ]);

        // Grade 9 Regular
        foreach (['Sapphire', 'Topaz'] as $name) {
            Section::create([
                'name' => $name,
                'grade_level_id' => $grade9->id,
                'is_special' => false,
            ]);
        }

        // Grade 9 Special
        Section::create([
            'name' => 'Curie',
            'grade_level_id' => $grade9->id,
            'is_special' => true,
            'cutoff_grade' => 85,
        ]);

        // Grade 10 Regular
        foreach (['Diamond', 'Opal'] as $name) {
            Section::create([
                'name' => $name,
                'grade_level_id' => $grade10->id,
                'is_special' => false,
            ]);
        }

        // Grade 10 Special
        Section::create([
            'name' => 'Tesla',
            'grade_level_id' => $grade10->id,
            'is_special' => true,
            'cutoff_grade' => 85,
        ]);

        // Grade 11 Regular
        foreach (['ICI', 'STEM'] as $name) {
            Section::create([
                'name' => $name,
                'grade_level_id' => $grade11->id,
                'is_special' => false,
            ]);
        }

        // Grade 12 Regular
        foreach (['ICT2', 'STEM2'] as $name) {
            Section::create([
                'name' => $name,
                'grade_level_id' => $grade12->id,
                'is_special' => false,
            ]);
        }
    }
}
