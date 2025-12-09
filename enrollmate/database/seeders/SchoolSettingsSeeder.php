<?php

namespace Database\Seeders;

use App\Models\SchoolSettings;
use Illuminate\Database\Seeder;

class SchoolSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['setting_name' => 'can_student_view_grades', 'value' => 'false', 'default_value' => 'false'],
            ['setting_name' => 'can_student_enroll', 'value' => 'false', 'default_value' => 'false'],

            ['setting_name' => 'enable_first_quarter_input', 'value' => 'false', 'default_value' => 'false'],
            ['setting_name' => 'enable_second_quarter_input', 'value' => 'false', 'default_value' => 'false'],
            ['setting_name' => 'enable_third_quarter_input', 'value' => 'false', 'default_value' => 'false'],
            ['setting_name' => 'enable_fourth_quarter_input', 'value' => 'false', 'default_value' => 'false'],
            ['setting_name' => 'enable_final_grade_input', 'value' => 'false', 'default_value' => 'false'],
            // Add more settings as needed
        ];

        foreach ($settings as $setting) {
            SchoolSettings::updateOrCreate(
                ['setting_name' => $setting['setting_name']],
                ['value' => $setting['value'], 'default_value' => $setting['default_value']]
            );
        }
    }
}
