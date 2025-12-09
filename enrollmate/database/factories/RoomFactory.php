<?php

namespace Database\Factories;

use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(2, true),
            'view' => $this->faker->unique()->words(2, true),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 500, 5000),
            'capacity' => $this->faker->numberBetween(1, 6),
            'number_of_bed' => $this->faker->numberBetween(1, 6),
            'size' => $this->faker->numberBetween(40, 80),
            'featured' => $this->faker->boolean(),
            'is_active' => $this->faker->boolean(),
            'room_type_id' => RoomType::inRandomOrder()->first()?->id ?? RoomType::factory(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($room) {
            $seedImages = Storage::disk('public')->files('seed_images');

            $selected = collect($seedImages)->random(rand(1, 3));

            foreach ($selected as $path) {
                $extension = pathinfo($path, PATHINFO_EXTENSION);
                $randomString = Str::random(8);
                $generatedName = "room_{$room->id}_{$randomString}.{$extension}";

                $newPath = "attachments/rooms/{$generatedName}";

                // Copy the file into attachments/rooms/
                Storage::disk('public')->copy($path, $newPath);

                // Create DB record for the attachment
                $attachment = \App\Models\FileAttachment::create([
                    'file_name' => $generatedName,
                    'file_path' => $newPath,
                    'file_type' => Storage::disk('public')->mimeType($newPath),
                ]);

                // Attach it to the room
                $room->fileAttachments()->attach($attachment->id);
            }
        });
    }
}
