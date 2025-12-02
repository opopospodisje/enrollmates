<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Section;
use App\Models\GradeLevel;

/**
 * @extends Factory<Section>
 */
class SectionFactory extends Factory
{
    protected $model = Section::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'grade_level_id' => GradeLevel::factory(),
            'is_special' => false,
        ];
    }
}
