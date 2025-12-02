<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Database\Seeders\RolesAndPermissionsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        // Create Admin
        $admin = User::create([
            'first_name'     => 'Admin',
            'last_name'      => 'Test',
            'contact_number' => '09123456789',
            'address'        => 'Baguio City',
            'email'          => 'admin@enrollmate.com',
            'email_verified_at' => Carbon::now(),
            'password'       => bcrypt('password'),
        ]);
        $admin->assignRole('admin');


        $this->call([
            SchoolYearSeeder::class,
            GradeLevelSeeder::class,
            SectionSeeder::class,
            TeacherSeeder::class,
            ClassGroupSeeder::class,
            SubjectSeeder::class,
            SpecificStudentSeeder::class,
            StudentSeeder::class,
            SchoolSettingsSeeder::class,
        ]);
    }
}
