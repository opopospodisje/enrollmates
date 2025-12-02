<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolYear;

class SchoolYearSeeder extends Seeder
{
    public function run(): void
    {
        $years = [
            '2020–2021',
            '2021–2022',
            '2022–2023',
            '2023–2024',
            '2024–2025',
            '2025–2026',
        ];

        foreach ($years as $year) {
            SchoolYear::updateOrCreate(
                ['name' => $year],
                ['is_active' => $year === '2025–2026']
            );
        }
    }
}
