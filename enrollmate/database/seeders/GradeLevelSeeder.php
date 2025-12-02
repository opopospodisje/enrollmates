<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GradeLevel;


class GradeLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10','Grade 11','Grade 12'];

        foreach ($grades as $grade) {
            GradeLevel::create([
                'name' => $grade,
            ]);
        }
    }
}
