<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = [
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'middle_name' => 'A',
                'email' => 'jane.smith@example.com',
                'contact_number' => '09123456701',
                'address' => '456 Teacher St',
                'gender' => 'Female',
            ],
            [
                'first_name' => 'John',
                'last_name' => 'Smith',
                'middle_name' => 'B',
                'email' => 'john.smith@example.com',
                'contact_number' => '09123456702',
                'address' => '123 Teacher St',
                'gender' => 'Male',
            ],
            [
                'first_name' => 'Alice',
                'last_name' => 'Brown',
                'middle_name' => 'C',
                'email' => 'alice.brown@example.com',
                'contact_number' => '09123456703',
                'address' => '789 Teacher St',
                'gender' => 'Female',
            ],
            [
                'first_name' => 'Bob',
                'last_name' => 'Johnson',
                'middle_name' => 'D',
                'email' => 'bob.johnson@example.com',
                'contact_number' => '09123456704',
                'address' => '321 Teacher St',
                'gender' => 'Male',
            ],
        ];

        foreach ($teachers as $t) {
            // Create user
            $user = User::create([
                'first_name' => $t['first_name'],
                'last_name' => $t['last_name'],
                'contact_number' => $t['contact_number'],
                'address' => $t['address'],
                'email' => $t['email'],
                'password' => bcrypt('password'),
            ]);

            $user->assignRole('teacher');

            // Create teacher linked to user
            Teacher::create([
                'user_id' => $user->id,
                'first_name' => $t['first_name'],
                'last_name' => $t['last_name'],
                'middle_name' => $t['middle_name'],
                'suffix' => null,
                'email' => $t['email'],
                'contact_number' => $t['contact_number'],
                'address' => $t['address'],
                'gender' => $t['gender'],
            ]);
        }
    }
}
